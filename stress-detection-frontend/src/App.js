// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./SimpleHome";
import Prediction from "./Prediction";
import Signup from "./SignUp";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import MotivationalQuotes from "./MotivationalQuotes";
import RelaxationGuide from "./RelaxationGuide";
import DailyJournal from "./DailyJournal";
import TimeManagement from "./TimeManagement";
import NutritionGuide from "./NutritionGuide";
import SleepHygiene from "./SleepHygiene";
import StressOverview from "./StressOverview";
import Navigation from "./Navigation";

function App() {
  return (
    <Router>
      <Routes>

        {/* HOME - Landing page with only Create Account and Sign In */}
        <Route path="/" element={<Home />} />

        {/* DASHBOARD - Main dashboard with all features */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* PREDICTION */}
        <Route path="/prediction" element={<Prediction />} />

        
        <Route path="/sign-up" element={<Signup />} />

        
        <Route path="/login" element={<Login />} />

        {/* REGISTER */}
        <Route path="/register" element={<Register />} />

        {/* WELLNESS FEATURES */}
        <Route path="/quotes" element={<MotivationalQuotes />} />
        <Route path="/relaxation" element={<RelaxationGuide />} />
        <Route path="/journal" element={<DailyJournal />} />
        <Route path="/time-management" element={<TimeManagement />} />
        <Route path="/nutrition" element={<NutritionGuide />} />
        <Route path="/sleep-hygiene" element={<SleepHygiene />} />
        <Route path="/stress-overview" element={<StressOverview />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;