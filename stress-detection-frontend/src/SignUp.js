// Signup.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("All fields are required.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true)
      navigate("/login"); // Redirect to login page after account creation
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>Create an Account</h2>
        <p style={styles.subtitle}>Join us to manage your stress and improve your wellness</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSignup} style={styles.form}>
          
          {/* Email Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              style={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Button */}
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

        </form>

        <p style={styles.switchText}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/login")}>
            Login
          </span>
        </p>

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
    marginBottom: "5px",
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
  switchText: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
    color: "#666"
  },
  link: {
    color: "#667eea",
    cursor: "pointer",
    fontWeight: "600"
  },
  error: {
    color: "#e74c3c",
    backgroundColor: "#ffebee",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
    fontSize: "14px"
  }
};