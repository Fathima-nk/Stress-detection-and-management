import requests
import json

# Test data
test_data = {
    "Study_Hours_Per_Day":
    "Extracurricular_Hours_Per_Day": 2.0,
    "Sleep_Hours_Per_Day": 7.5,
    "Social_Hours_Per_Day": 2.5,
    "Physical_Activity_Hours_Per_Day": 1.0,
    "GPA": 3.0
}

# Send POST request
response = requests.post(
    'http://127.0.0.1:5000/predict',
    headers={'Content-Type': 'application/json'},
    data=json.dumps(test_data)
)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")