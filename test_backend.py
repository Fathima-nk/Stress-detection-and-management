import requests
import json

# Test data
test_data = {
    "Study_Hours_Per_Day": 7.0,
    "Extracurricular_Hours_Per_Day": 2.0,
    "Sleep_Hours_Per_Day": 7.5,
    "Social_Hours_Per_Day": 2.5,
    "Physical_Activity_Hours_Per_Day": 1.0,
    "GPA": 3.0
}

# Send request to backend
try:
    response = requests.post(
        'http://127.0.0.1:5000/predict',
        json=test_data,
        headers={'Content-Type': 'application/json'}
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")