import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from './api';

export default function Navigation() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Clear user authentication status
    logout();
    // Redirect to home page
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <div style={styles.navContainer}>
        <button 
          style={styles.navButton} 
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <button 
          style={{...styles.navButton, ...styles.logoutButton}} 
          onClick={handleLogoutClick}
        >
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
    </>
  );
}

const styles = {
  navContainer: {
    position: "absolute",
    top: "20px",
    left: "20px",
    right: "20px",
    display: "flex",
    justifyContent: "space-between",
    zIndex: 1000,
    padding: "0 10px"
  },
  navButton: {
    padding: "12px 25px",
    background: "transparent",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
    color: "white",
    backdropFilter: "blur(10px)"
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
    zIndex: 2000
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