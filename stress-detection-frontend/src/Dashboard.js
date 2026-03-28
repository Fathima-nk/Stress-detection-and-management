// Dashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from './api';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // State for logout confirmation
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handlePredictionClick = () => {
    console.log("Prediction button clicked");
    navigate("/prediction");
  };

  const handleFeatureClick = (path) => {
    console.log("Feature clicked, navigating to:", path);
    navigate(path);
  };

  const handleStressOverviewClick = () => {
    console.log("Stress Overview button clicked");
    navigate("/stress-overview");
  };

  const handleProfileClick = () => {
    console.log("Profile button clicked");
    // Navigate to profile page (you can create this later)
    alert("Profile page - Coming soon!");
  };

  const handleAboutUsClick = () => {
    console.log("About Us button clicked");
    // Navigate to about us page (you can create this later)
    alert("About Us page - Coming soon!");
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    console.log("User logged out");
    logout();
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div style={{...styles.container, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}}>
      {/* Top Right Navigation Buttons */}
      <div style={styles.topNavContainer}>
        <button style={styles.topNavButton} onClick={handleProfileClick}>
           Profile
        </button>
        <button style={styles.topNavButton} onClick={handleAboutUsClick}>
           About Us
        </button>
        <button style={{...styles.topNavButton, ...styles.logoutButton}} onClick={handleLogoutClick}>
           Logout
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Confirm Logout</h3>
            <p style={styles.modalMessage}>Are you sure you want to logout?</p>
            <div style={styles.modalButtons}>
              <button style={styles.confirmButton} onClick={confirmLogout}>
                Yes, Logout
              </button>
              <button style={styles.cancelButton} onClick={cancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.header}>
        <h1 style={styles.title}>Inner Compass</h1>
        {/* <p style={styles.subtitle}>Your comprehensive wellness dashboard</p> */}
      </div>



      <div style={styles.grid}>
        {/* Prediction Tool */}
        <div 
          style={styles.card} 
          onClick={handlePredictionClick}
        >
          <div style={styles.icon}>📊</div>
          <h3 style={styles.cardTitle}>Stress Prediction</h3>
          <p style={styles.cardDescription}>Predict your stress level based on lifestyle factors</p>
        </div>

        {/* Journal */}
        <div 
          style={styles.card} 
          onClick={() => handleFeatureClick("/journal")}
        >
          <div style={styles.icon}>📝</div>
          <h3 style={styles.cardTitle}>Daily Journal</h3>
          <p style={styles.cardDescription}>Track your thoughts and emotions</p>
        </div>

        {/* Quotes */}
        <div 
          style={styles.card} 
          onClick={() => handleFeatureClick("/quotes")}
        >
          <div style={styles.icon}>💭</div>
          <h3 style={styles.cardTitle}>Motivational Quotes</h3>
          <p style={styles.cardDescription}>Get inspired with daily motivation</p>
        </div>

        {/* Relaxation */}
        <div 
          style={styles.card} 
          onClick={() => handleFeatureClick("/relaxation")}
        >
          <div style={styles.icon}>🧘</div>
          <h3 style={styles.cardTitle}>Relaxation Guide</h3>
          <p style={styles.cardDescription}>Learn techniques to reduce stress</p>
        </div>

        {/* Time Management */}
        <div 
          style={styles.card} 
          onClick={() => handleFeatureClick("/time-management")}
        >
          <div style={styles.icon}>⏳</div>
          <h3 style={styles.cardTitle}>Time Management</h3>
          <p style={styles.cardDescription}>Improve your productivity and focus</p>
        </div>

        {/* Nutrition */}
        <div 
          style={styles.card} 
          onClick={() => handleFeatureClick("/nutrition")}
        >
          <div style={styles.icon}>🍎</div>
          <h3 style={styles.cardTitle}>Nutrition Guide</h3>
          <p style={styles.cardDescription}>Optimize your diet for better focus</p>
        </div>

        {/* Sleep Hygiene */}
        <div 
          style={styles.card} 
          onClick={() => handleFeatureClick("/sleep-hygiene")}
        >
          <div style={styles.icon}>🛌</div>
          <h3 style={styles.cardTitle}>Sleep Hygiene</h3>
          <p style={styles.cardDescription}>Improve your sleep quality</p>
        </div>
        
        {/* Stress Overview Button */}
        <div 
          style={styles.card} 
          onClick={handleStressOverviewClick}
        >
          <div style={styles.icon}>📊</div>
          <h3 style={styles.cardTitle}>Stress Overview</h3>
          <p style={styles.cardDescription}>View your weekly stress levels</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    position: "relative",
    overflow: "hidden"
  },
  header: {
    textAlign: "center",
    padding: "30px 0",
    maxWidth: "800px",
    margin: "0 auto",
    position: "relative",
    zIndex: 2
  },
  title: {
    fontSize: "48px",
    fontWeight: "bold",
    color: "white",
    marginBottom: "10px",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)"
  },
  subtitle: {
    fontSize: "18px",
    color: "rgba(255,255,255,0.95)",
    marginBottom: "30px"
  },
  graphContainer: {
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255,255,255,0.2)",
    maxWidth: "1200px",
    margin: "0 auto 30px",
    position: "relative",
    zIndex: 2
  },
  graphTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
    textAlign: "center"
  },
  graph: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: "200px",
    padding: "20px 0"
  },
  barContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%"
  },
  bar: {
    width: "40px",
    minWidth: "40px",
    borderRadius: "5px 5px 0 0",
    marginBottom: "10px",
    transition: "all 0.3s ease"
  },
  barLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "5px"
  },
  levelLabel: {
    fontSize: "12px",
    color: "#666"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "25px",
    maxWidth: "1200px",
    margin: "0 auto",
    position: "relative",
    zIndex: 2
  },
  card: {
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "15px",
    padding: "30px 25px",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "1px solid rgba(255,255,255,0.2)",
    position: "relative",
    overflow: "hidden"
  },
  icon: {
    fontSize: "52px",
    marginBottom: "20px"
  },
  cardTitle: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "12px"
  },
  cardDescription: {
    fontSize: "15px",
    color: "#666",
    lineHeight: "1.5"
  },
  topNavContainer: {
    position: "absolute",
    top: "20px",
    right: "20px",
    display: "flex",
    gap: "15px",
    zIndex: 10
  },
  topNavButton: {
    padding: "10px 20px",
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    backdropFilter: "blur(5px)"
  },
  logoutButton: {
    color: "white",
    fontWeight: "700"
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
  modalContent: {
    background: "white",
    borderRadius: "15px",
    padding: "30px",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
    textAlign: "center"
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "15px"
  },
  modalMessage: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "25px",
    lineHeight: "1.5"
  },
  modalButtons: {
    display: "flex",
    gap: "15px",
    justifyContent: "center"
  },
  confirmButton: {
    padding: "12px 30px",
    background: "#f05454",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  cancelButton: {
    padding: "12px 30px",
    background: "#667eea",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease"
  }
};

// Add hover effect using JavaScript
const addHoverEffect = () => {
  const cards = document.querySelectorAll('[style*="cursor: pointer"]');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px)';
      card.style.boxBoxShadow = '0 15px 35px rgba(0,0,0,0.3)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxBoxShadow = '0 8px 25px rgba(0,0,0,0.2)';
    });
  });
  
  // Add hover effects for top nav buttons
  const topNavButtons = document.querySelectorAll('[style*="topNavButton"]');
  topNavButtons.forEach(btn => {
    btn.addEventListener('mouseenter', (e) => {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
    });
    btn.addEventListener('mouseleave', (e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    });
  });
};

// Apply hover effect when component mounts
setTimeout(addHoverEffect, 100);