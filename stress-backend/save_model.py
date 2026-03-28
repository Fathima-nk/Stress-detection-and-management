import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from joblib import dump # Tool for saving the model

# 1. Load the data
# Ensure 'student_lifestyle_dataset.csv' is in the same folder
df = pd.read_csv('student_lifestyle_dataset.csv')

# 2. Define Features (X) and Target (y)
# These six features MUST match the inputs expected by the frontend
features = [
    'Study_Hours_Per_Day',
    'Extracurricular_Hours_Per_Day',
    'Sleep_Hours_Per_Day',
    'Social_Hours_Per_Day',
    'Physical_Activity_Hours_Per_Day',
    'GPA'
]
X = df[features]
y = df['Stress_Level']

# 3. Train the Decision Tree Model
# The Decision Tree Classifier is chosen based on your project's finding (1.00 accuracy).
model = DecisionTreeClassifier(random_state=42)
model.fit(X, y)

# 4. Save the model to disk
# This creates a binary file 'stress_model.joblib' which is fast to load later.
dump(model, 'stress_model.joblib')

print("Model trained and saved successfully as 'stress_model.joblib'")