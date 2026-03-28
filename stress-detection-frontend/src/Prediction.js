import React, { useState, useEffect } from 'react';
import './App.css';
import Navigation from './Navigation';
import { useNavigate } from 'react-router-dom';
import { predictStress, getLatestPrediction } from './api';

// API endpoint
const API_URL = 'http://127.0.0.1:5000/predict';

function Prediction() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    Study_Hours_Per_Day: '',
    Extracurricular_Hours_Per_Day: '',
    Sleep_Hours_Per_Day: '',
    Social_Hours_Per_Day: '',
    Physical_Activity_Hours_Per_Day: '',
    GPA: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load latest prediction on component mount
  useEffect(() => {
    const loadLatestPrediction = async () => {
      try {
        // Clear any invalid tokens first
        const token = localStorage.getItem('authToken');
        if (token === 'null' || token === 'undefined' || token === '') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
        
        const data = await getLatestPrediction();
        if (data.stress_level) {
          setPrediction(data.stress_level);
        }
      } catch (err) {
        // If user not authenticated, ignore error
        console.log('Could not load latest prediction:', err.message);
      }
    };
    loadLatestPrediction();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    setError(null);

    // Convert empty strings to 0 for numeric fields
    const requestData = {
      Study_Hours_Per_Day: parseFloat(formData.Study_Hours_Per_Day) || 0,
      Extracurricular_Hours_Per_Day: parseFloat(formData.Extracurricular_Hours_Per_Day) || 0,
      Sleep_Hours_Per_Day: parseFloat(formData.Sleep_Hours_Per_Day) || 0,
      Social_Hours_Per_Day: parseFloat(formData.Social_Hours_Per_Day) || 0,
      Physical_Activity_Hours_Per_Day: parseFloat(formData.Physical_Activity_Hours_Per_Day) || 0,
      GPA: parseFloat(formData.GPA) || 0,
    };

    // validation
    if (
      requestData.Study_Hours_Per_Day +
        requestData.Extracurricular_Hours_Per_Day +
        requestData.Sleep_Hours_Per_Day +
        requestData.Social_Hours_Per_Day +
        requestData.Physical_Activity_Hours_Per_Day >
      24
    ) {
      alert('Invalid data: Total hours per day cannot exceed 24');
      setLoading(false);
      return;
    }

    try {
      console.log('Sending prediction request with data:', requestData);
      const data = await predictStress(requestData);
      console.log('Prediction response:', data);
      setPrediction(data.stress_level);
      // Also save to localStorage for quick access
      localStorage.setItem('stressPrediction', data.stress_level);
    } catch (err) {
      console.error('Prediction failed:', err);
      console.error('Error details:', err.message);
      
      // Show detailed error message
      let errorMsg = 'Prediction failed. ';
      if (err.message.includes('Failed to fetch')) {
        errorMsg += 'Cannot connect to server. Make sure the backend is running on http://127.0.0.1:5000';
      } else if (err.message.includes('Model not loaded')) {
        errorMsg += 'ML model file (stress_model.joblib) is missing from the backend folder.';
      } else {
        errorMsg += err.message;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getResultStyle = (level) => {
    switch (level ? level.toLowerCase() : '') {
      case 'high':
        return { backgroundColor: '#f05454', color: 'white' };
      case 'moderate':
        return { backgroundColor: '#f9c449', color: 'black' };
      case 'low':
        return { backgroundColor: '#4caf50', color: 'white' };
      default:
        return { backgroundColor: '#cccccc', color: 'black' };
    }
  };

  const getSuggestions = (level) => {
    const levelLower = level ? level.toLowerCase() : '';
    
    if (levelLower === 'low') {
      return {
        title: 'Great Job! Keep It Up',
        suggestions: [
          'Continue maintaining your balanced schedule',
          'Keep up with regular physical activity',
          'Maintain consistent sleep patterns',
          'Stay connected with friends and family'
        ]
      };
    } else if (levelLower === 'moderate') {
      return {
        title: 'Time to Make Some Adjustments',
        suggestions: [
          'Review your daily schedule and prioritize important tasks',
          'Ensure you\'re getting 7-8 hours of sleep each night',
          'Take regular breaks during study sessions',
          'Incorporate 30 minutes of physical activity daily',
          'Practice relaxation techniques like deep breathing',
          'Limit caffeine intake, especially in the evening'
        ]
      };
    } else if (levelLower === 'high') {
      return {
        title: 'Immediate Action Recommended',
        suggestions: [
          'Consider reducing your workload if possible',
          'Prioritize sleep - aim for 8+ hours per night',
          'Reach out to a counselor or mental health professional',
          'Practice daily stress-reduction techniques (meditation, yoga)',
          'Make time for social connections and support',
          'Reduce study hours and take frequent breaks',
          'Evaluate and adjust extracurricular commitments',
          'Create a structured daily routine with built-in downtime'
        ]
      };
    }
    return null;
  };

  const InputField = ({ label, name, value, min, max, step }) => (
    <div className="input-group">
      <label htmlFor={name}>{label}</label>
      <input
        type="number"
        id={name}
        name={name}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        required
      />
    </div>
  );

  return (
    <div className="App" style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      padding: "20px",
      position: "relative",
      overflow: "auto"
    }}>
      <Navigation />
      <header className="App-header" style={{
        background: "transparent",
        borderRadius: "15px",
        padding: "20px 30px",
        marginBottom: "30px",
        border: "none",
        maxWidth: "700px",
        margin: "0 auto 30px"
      }}>
        <h1 style={{
          fontSize: "36px",
          fontWeight: "bold",
          color: "white",
          marginBottom: "15px",
          textShadow: "0 2px 4px rgba(0,0,0,0.3)"
        }}>Student Stress Level Predictor</h1>
        <p style={{
          fontSize: "18px",
          color: "rgba(255, 255, 255, 0.95)",
          maxWidth: "600px",
          margin: "0 auto",
          lineHeight: "1.6"
        }}>Enter student lifestyle data to predict stress levels.</p>
      </header>

      <form onSubmit={handleSubmit} className="prediction-form" style={{
        background: "rgba(255, 255, 255, 0.9)",
        borderRadius: "15px",
        padding: "30px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
        border: "1px solid rgba(255,255,255,0.2)",
        maxWidth: "700px",
        margin: "0 auto"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
          marginBottom: "25px"
        }}>
          <InputField
            label="Study Hours Per Day"
            name="Study_Hours_Per_Day"
            value={formData.Study_Hours_Per_Day}
            min="0"
            max="24"
            step="0.1"
          />

          <InputField
            label="Extracurricular Hours Per Day"
            name="Extracurricular_Hours_Per_Day"
            value={formData.Extracurricular_Hours_Per_Day}
            min="0"
            max="10"
            step="0.1"
          />

          <InputField
            label="Sleep Hours Per Day"
            name="Sleep_Hours_Per_Day"
            value={formData.Sleep_Hours_Per_Day}
            min="0"
            max="14"
            step="0.1"
          />

          <InputField
            label="Social Hours Per Day"
            name="Social_Hours_Per_Day"
            value={formData.Social_Hours_Per_Day}
            min="0"
            max="10"
            step="0.1"
          />

          <InputField
            label="Physical Activity Hours Per Day"
            name="Physical_Activity_Hours_Per_Day"
            value={formData.Physical_Activity_Hours_Per_Day}
            min="0"
            max="10"
            step="0.1"
          />

          <InputField
            label="GPA (0.0 to 4.0)"
            name="GPA"
            value={formData.GPA}
            min="0"
            max="4.0"
            step="0.01"
          />
        </div>

        <button type="submit" disabled={loading} style={{
          padding: "15px 30px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          borderRadius: "10px",
          color: "white",
          fontSize: "18px",
          fontWeight: "600",
          cursor: "pointer",
          width: "100%",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
        }}>
          {loading ? 'Predicting...' : 'Predict Stress Level'}
        </button>
      </form>

      {error && (
        <div className="result-container error-message" style={{
          background: "rgba(255, 235, 238, 0.95)",
          borderRadius: "10px",
          padding: "20px",
          marginTop: "25px",
          border: "1px solid rgba(244, 67, 54, 0.5)",
          maxWidth: "700px",
          margin: "25px auto 0",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
        }}>
          <p style={{
            color: "#c62828",
            fontSize: "16px",
            margin: 0
          }}>
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {prediction && (
        <div className="result-container" style={{
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "15px",
          padding: "30px",
          marginTop: "25px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.2)",
          maxWidth: "700px",
          margin: "25px auto 0",
          textAlign: "center"
        }}>
          <h2 style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#333",
            marginBottom: "20px"
          }}>Predicted Stress Level:</h2>
          <div className="prediction-box" style={{
            ...getResultStyle(prediction),
            padding: "25px",
            borderRadius: "12px",
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
          }}>
            {prediction ? prediction.toUpperCase() : 'UNKNOWN'}
          </div>
          <p className="prediction-tip" style={{
            fontSize: "16px",
            color: "#666",
            fontStyle: "italic"
          }}>
            {prediction && prediction.toLowerCase() === 'high'
              ? '🚨 Intervention recommended.'
              : prediction && prediction.toLowerCase() === 'moderate'
              ? '⚠️ Monitor closely.'
              : prediction && prediction.toLowerCase() === 'low'
              ? '✅ Balanced schedule.'
              : 'Prediction not available.'}
          </p>

          {/* Suggestions Section */}
          {getSuggestions(prediction) && (
            <div style={{
              marginTop: "30px",
              padding: "25px",
              background: "#f8f9fa",
              borderRadius: "12px",
              textAlign: "left",
              border: "1px solid #e0e0e0"
            }}>
              <h3 style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#333",
                marginBottom: "15px",
                textAlign: "center"
              }}>
                {getSuggestions(prediction).title}
              </h3>
              <ul style={{
                listStyleType: "none",
                padding: 0,
                margin: 0
              }}>
                {getSuggestions(prediction).suggestions.map((suggestion, index) => (
                  <li key={index} style={{
                    fontSize: "15px",
                    color: "#555",
                    marginBottom: "12px",
                    paddingLeft: "25px",
                    position: "relative",
                    lineHeight: "1.5"
                  }}>
                    <span style={{
                      position: "absolute",
                      left: "0",
                      color: "#667eea",
                      fontWeight: "bold"
                    }}>•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
              
              {/* Link to Motivational Quotes */}
              <div style={{
                marginTop: "20px",
                paddingTop: "20px",
                borderTop: "1px solid #e0e0e0",
                textAlign: "center"
              }}>
                <button 
                  onClick={() => navigate('/quotes')}
                  style={{
                    padding: "12px 25px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 10px rgba(102, 126, 234, 0.3)"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 10px rgba(102, 126, 234, 0.3)";
                  }}
                >
                  💭 Get Motivational Quotes
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Prediction;