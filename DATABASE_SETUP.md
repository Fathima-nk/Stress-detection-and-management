# Database Setup Instructions

## Step 1: Create MySQL Database via phpMyAdmin

1. **Start XAMPP:**
   - Open XAMPP Control Panel
   - Start **Apache** and **MySQL** services

2. **Open phpMyAdmin:**
   - Go to: http://localhost/phpmyadmin/
   - Click on "SQL" tab at the top

3. **Import Database Schema:**
   - Copy ALL the content from `stress-backend/database_schema.sql`
   - Paste it into the SQL query box in phpMyAdmin
   - Click "Go" button to execute
   - You should see success messages for:
     * Database created: `stress_management_db`
     * Table created: `users`
     * Table created: `journal_entries`
     * Table created: `stress_predictions`

4. **Verify Tables:**
   - Click on `stress_management_db` in the left sidebar
   - You should see 3 tables listed

## Step 2: Install Python Dependencies

1. **Navigate to backend folder:**
   ```cmd
   cd stress-backend
   ```

2. **Install dependencies:**
   ```cmd
   pip install -r requirements.txt
   ```

   This will install:
   - Flask (web framework)
   - flask-cors (CORS support)
   - flask-sqlalchemy (database ORM)
   - flask-jwt-extended (JWT authentication)
   - mysql-connector-python (MySQL driver)
   - And other dependencies

## Step 3: Start the Backend Server

1. **Still in stress-backend folder, run:**
   ```cmd
   python app.py
   ```

2. **You should see output like:**
   ```
   Machine Learning Model loaded successfully.
    * Serving Flask app 'app'
    * Debug mode: on
    * Running on http://127.0.0.1:5000
   ```

3. **Keep this terminal running!**

## Step 4: Start the Frontend

1. **Open a NEW terminal**

2. **Navigate to frontend folder:**
   ```cmd
   cd stress-detection-frontend
   ```

3. **Start React app:**
   ```cmd
   npm start
   ```

4. **Browser should open automatically to:**
   http://localhost:3000

## Step 5: Test the System

1. **Register a new account:**
   - Go to http://localhost:3000
   - Click "Create Account"
   - Fill in: Name, Email, Password
   - Submit

2. **Login:**
   - You'll be redirected to login page
   - Enter your email and password
   - Click "Sign In"

3. **Test Features:**
   - **Dashboard:** Should show all features
   - **Journal:** Click a date, add entries (saved to database!)
   - **Stress Prediction:** Fill form, submit (saved to database!)

## Verification Checklist

✅ XAMPP running (Apache + MySQL)
✅ Database `stress_management_db` created
✅ 3 tables visible in phpMyAdmin
✅ Backend running on port 5000
✅ Frontend running on port 3000
✅ Can register new account
✅ Can login successfully
✅ Can add journal entries
✅ Can make stress predictions

## Troubleshooting

### "Can't connect to MySQL server"
- Make sure MySQL is running in XAMPP
- Check if port 3306 is being used by another program

### "Module not found" errors
- Run: `pip install -r requirements.txt` again
- Make sure you're in the `stress-backend` folder

### "401 Unauthorized" errors in frontend
- Make sure you're logged in
- Try logging out and logging back in
- Check if backend is running

### Journal/Prediction not saving
- Check browser console for errors (F12)
- Verify backend terminal shows no errors
- Check if you're logged in

## Database Connection String

The backend connects using:
```
mysql+mysqlconnector://root:@localhost:3306/stress_management_db
```

- **Host:** localhost
- **Port:** 3306
- **Username:** root
- **Password:** (blank)
- **Database:** stress_management_db

## What Changed from localStorage?

### Before (localStorage):
- Data stored in browser only
- Lost on browser clear
- Not accessible from other devices
- No security

### After (Database):
- Data stored in MySQL database
- Persistent and backed up
- Accessible from any device (with login)
- Secure with JWT authentication
- Multi-user support

## Next Steps

1. **Add more users** - Test with multiple accounts
2. **View data in phpMyAdmin** - See your journal entries and predictions
3. **Try from different browsers** - Your data persists across logins!

Enjoy your upgraded stress management application! 🎉
