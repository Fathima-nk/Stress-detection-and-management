// Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from './api';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      return setError("All fields are required.");
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    try {
      setLoading(true);
      // Register user via API
      await register(formData.email, formData.password, formData.name);
      // After registration, redirect to login page
      navigate("/login");
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Your Account</h2>
        <p style={styles.subtitle}>Join us to manage your stress and improve your wellness</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleRegister} style={styles.form}>
          {/* Name */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              style={styles.input}
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              style={styles.input}
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              style={styles.input}
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Confirm Password */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              style={styles.input}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {/* Register Button */}
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerText}>Already have an account?</span>
        </div>

        <button 
          style={styles.secondaryButton} 
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px"
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "30px",
    borderRadius: "12px",
    background: "white",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    textAlign: "center"
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333"
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "25px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    textAlign: "left"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column"
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "5px",
    color: "#333"
  },
  input: {
    padding: "12px 15px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    transition: "border-color 0.3s"
  },
  button: {
    marginTop: "10px",
    padding: "14px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    color: "white",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s"
  },
  secondaryButton: {
    marginTop: "15px",
    padding: "12px",
    background: "transparent",
    border: "1px solid #667eea",
    color: "#667eea",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%"
  },
  divider: {
    margin: "20px 0",
    position: "relative"
  },
  dividerText: {
    background: "white",
    padding: "0 15px",
    color: "#666",
    fontSize: "14px"
  },
  error: {
    color: "#e74c3c",
    backgroundColor: "#ffebee",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
    fontSize: "14px"
  },
  link: {
    color: "#667eea",
    cursor: "pointer",
    textDecoration: "underline"
  }
};