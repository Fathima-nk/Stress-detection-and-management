from flask import Flask, request, jsonify
from flask_cors import CORS
from joblib import load
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import mysql.connector

# Initialize Flask application
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'  # Change this in production!
app.config['JWT_SECRET_KEY'] = 'jwt-secret-key-change-in-production'  # Change this in production!
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:@localhost:3306/stress_management_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# IMPORTANT: Enable Cross-Origin Resource Sharing (CORS). 
# This is required so the React app (running on port 3000) 
# can make requests to this API (running on port 5000).
CORS(app, origins=["http://localhost:3000", "http://localhost:3001"])

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

# JWT error handlers
@jwt.invalid_token_loader
def invalid_token_callback(error):
    auth_header = request.headers.get('Authorization', 'No header')
    print(f"Invalid token error: {error}")
    print(f"Authorization header: {auth_header[:100] if auth_header != 'No header' else 'MISSING'}")
    
    # Try to manually decode for debugging
    if auth_header != 'No header' and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        print(f"Token extracted: {token[:50]}...")
        try:
            import jwt
            decoded = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            print(f"Manual decode SUCCESS: {decoded}")
        except Exception as e:
            print(f"Manual decode FAILED: {e}")
    
    return jsonify({'error': 'Invalid token', 'details': str(error)}), 422

@jwt.unauthorized_loader
def unauthorized_callback(error):
    print(f"Unauthorized error: {error}")
    return jsonify({'error': 'Missing authorization header', 'details': str(error)}), 401

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    print(f"Expired token")
    return jsonify({'error': 'Token has expired'}), 401

# Database Models
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    journal_entries = db.relationship('JournalEntry', backref='user', cascade='all, delete-orphan')
    stress_predictions = db.relationship('StressPrediction', backref='user', cascade='all, delete-orphan')

class JournalEntry(db.Model):
    __tablename__ = 'journal_entries'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    entry_date = db.Column(db.Date, nullable=False)
    entry_text = db.Column(db.Text, nullable=False)
    entry_time = db.Column(db.String(10), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class StressPrediction(db.Model):
    __tablename__ = 'stress_predictions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    prediction_date = db.Column(db.Date, nullable=False)
    stress_level = db.Column(db.String(50), nullable=False)
    study_hours = db.Column(db.Numeric(4, 2))
    sleep_hours = db.Column(db.Numeric(4, 2))
    social_hours = db.Column(db.Numeric(4, 2))
    physical_activity_hours = db.Column(db.Numeric(4, 2))
    extracurricular_hours = db.Column(db.Numeric(4, 2))
    gpa = db.Column(db.Numeric(3, 2))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Load the trained model saved in Step 3
try:
    # Loads the 'stress_model.joblib' file
    model = load('stress_model.joblib')
    print("Machine Learning Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    # Set model to None so the API can return an error if loading fails
    model = None

# Define the expected feature order
# This ensures data sent by the frontend is processed in the same order the model was trained on.
FEATURE_ORDER = [
    'Study_Hours_Per_Day',
    'Extracurricular_Hours_Per_Day',
    'Sleep_Hours_Per_Day',
    'Social_Hours_Per_Day',
    'Physical_Activity_Hours_Per_Day',
    'GPA'
]

# ==================== Authentication Endpoints ====================

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name')
        
        if not email or not password or not full_name:
            return jsonify({'error': 'All fields are required'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create new user
        password_hash = generate_password_hash(password)
        new_user = User(email=email, password_hash=password_hash, full_name=full_name)
        
        db.session.add(new_user)
        db.session.commit()
        
        # Create access token with string identity
        access_token = create_access_token(identity=str(new_user.id))
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': {
                'id': new_user.id,
                'email': new_user.email,
                'full_name': new_user.full_name
            }
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        print(f"Login attempt for email: {email}")
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=email).first()
        
        if not user or not check_password_hash(user.password_hash, password):
            print(f"Login failed: Invalid credentials")
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Create access token with string identity
        access_token = create_access_token(identity=str(user.id))
        print(f"Login successful for user {user.id}")
        print(f"Generated token: {access_token[:50]}...")
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'full_name': user.full_name
            }
        }), 200
    
    except Exception as e:
        print(f"Login error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# ==================== Journal Endpoints ====================

@app.route('/journal/entries', methods=['GET'])
@jwt_required()
def get_journal_entries():
    try:
        # Log the authorization header
        auth_header = request.headers.get('Authorization', 'No header')
        print(f"GET /journal/entries - Auth header: {auth_header[:100] if auth_header != 'No header' else auth_header}")
        
        user_id = int(get_jwt_identity())  # Convert string to int
        print(f"User ID from token: {user_id}")
        
        entries = JournalEntry.query.filter_by(user_id=user_id).order_by(JournalEntry.entry_date.desc(), JournalEntry.created_at.desc()).all()
        
        # Group entries by date
        entries_by_date = {}
        for entry in entries:
            date_key = entry.entry_date.strftime('%Y-%m-%d')
            if date_key not in entries_by_date:
                entries_by_date[date_key] = []
            entries_by_date[date_key].append({
                'id': entry.id,
                'text': entry.entry_text,
                'timestamp': entry.entry_time
            })
        
        print(f"Returning {len(entries)} entries")
        return jsonify(entries_by_date), 200
    
    except Exception as e:
        print(f"Error fetching journal entries: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/journal/entries', methods=['POST'])
@jwt_required()
def add_journal_entry():
    try:
        user_id = int(get_jwt_identity())  # Convert string to int
        data = request.get_json()
        
        print(f"Adding journal entry for user {user_id}")
        print(f"Data received: {data}")
        
        entry_date = datetime.strptime(data.get('entry_date'), '%Y-%m-%d').date()
        entry_text = data.get('entry_text')
        entry_time = data.get('entry_time')
        
        if not entry_text:
            return jsonify({'error': 'Entry text is required'}), 400
        
        new_entry = JournalEntry(
            user_id=user_id,
            entry_date=entry_date,
            entry_text=entry_text,
            entry_time=entry_time
        )
        
        db.session.add(new_entry)
        db.session.commit()
        
        print(f"Entry added successfully with ID: {new_entry.id}")
        
        return jsonify({
            'message': 'Entry added successfully',
            'entry': {
                'id': new_entry.id,
                'text': new_entry.entry_text,
                'timestamp': new_entry.entry_time
            }
        }), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Error adding journal entry: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/journal/entries/<int:entry_id>', methods=['DELETE'])
@jwt_required()
def delete_journal_entry(entry_id):
    try:
        user_id = int(get_jwt_identity())  # Convert string to int
        entry = JournalEntry.query.filter_by(id=entry_id, user_id=user_id).first()
        
        if not entry:
            return jsonify({'error': 'Entry not found'}), 404
        
        db.session.delete(entry)
        db.session.commit()
        
        return jsonify({'message': 'Entry deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ==================== Stress Prediction Endpoints ====================

@app.route('/predict', methods=['POST'])
@jwt_required(optional=True)
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded on the server."}), 500

    try:
        user_id = get_jwt_identity()  # Will be None or string if authenticated
        if user_id:
            user_id = int(user_id)  # Convert string to int
        # Get JSON data from the POST request (sent by the React frontend)
        data = request.get_json(force=True)
        
        # Build the input array in the correct order
        input_data = [data[feature] for feature in FEATURE_ORDER]
        
        # Model requires input as a list of samples (even if only one)
        features_array = [input_data]

        # Make the prediction
        prediction = model.predict(features_array)[0]
        
        # Save prediction to database only if user is authenticated
        if user_id:
            print(f"Saving prediction for user {user_id}: {prediction}")
            new_prediction = StressPrediction(
                user_id=user_id,
                prediction_date=datetime.utcnow().date(),
                stress_level=str(prediction),
                study_hours=data.get('Study_Hours_Per_Day'),
                sleep_hours=data.get('Sleep_Hours_Per_Day'),
                social_hours=data.get('Social_Hours_Per_Day'),
                physical_activity_hours=data.get('Physical_Activity_Hours_Per_Day'),
                extracurricular_hours=data.get('Extracurricular_Hours_Per_Day'),
                gpa=data.get('GPA')
            )
            
            db.session.add(new_prediction)
            db.session.commit()
            print(f"Prediction saved successfully with ID: {new_prediction.id}")
        else:
            print("User not authenticated - prediction not saved to database")

        # Return the prediction result as a JSON response
        return jsonify({
            'stress_level': str(prediction)  # Convert to string to ensure JSON serialization
        })

    except Exception as e:
        if user_id:
            db.session.rollback()
        # This catches errors like missing features or wrong data types
        return jsonify({
            'error': 'Invalid input data or server error.', 
            'details': str(e)
        }), 400

@app.route('/predictions/history', methods=['GET'])
@jwt_required()
def get_prediction_history():
    try:
        user_id = int(get_jwt_identity())  # Convert string to int
        predictions = StressPrediction.query.filter_by(user_id=user_id).order_by(StressPrediction.prediction_date.desc()).all()
        
        history = [{
            'id': p.id,
            'date': p.prediction_date.strftime('%Y-%m-%d'),
            'stress_level': p.stress_level,
            'study_hours': float(p.study_hours) if p.study_hours else None,
            'sleep_hours': float(p.sleep_hours) if p.sleep_hours else None,
            'social_hours': float(p.social_hours) if p.social_hours else None,
            'physical_activity_hours': float(p.physical_activity_hours) if p.physical_activity_hours else None,
            'extracurricular_hours': float(p.extracurricular_hours) if p.extracurricular_hours else None,
            'gpa': float(p.gpa) if p.gpa else None
        } for p in predictions]
        
        return jsonify(history), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predictions/latest', methods=['GET'])
@jwt_required()
def get_latest_prediction():
    try:
        user_id = int(get_jwt_identity())  # Convert string to int
        prediction = StressPrediction.query.filter_by(user_id=user_id).order_by(StressPrediction.prediction_date.desc()).first()
        
        if not prediction:
            return jsonify({'stress_level': None}), 200
        
        return jsonify({
            'stress_level': prediction.stress_level,
            'date': prediction.prediction_date.strftime('%Y-%m-%d')
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Create database tables if they don't exist
    with app.app_context():
        try:
            db.create_all()
            print("Database tables created/verified successfully.")
        except Exception as e:
            print(f"Warning: Could not create tables: {e}")
    
    # Start the Flask server on the default port 5000
    # The React frontend is configured to call this exact address
    app.run(host='127.0.0.1', port=5000, debug=True)