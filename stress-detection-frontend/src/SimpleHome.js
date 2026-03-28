import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();
  return (
    <div className="home-container" style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Decorative elements */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "10%",
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
      }}></div>
      
      <div style={{
        position: "absolute",
        bottom: "15%",
        right: "15%",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
      }}></div>

      <header className="home-header" style={{
        marginBottom: "40px",
        position: "relative",
        zIndex: 2
      }}>
        <h1 style={{
          fontSize: "52px",
          fontWeight: "bold",
          color: "white",
          marginBottom: "15px",
          textShadow: "0 4px 8px rgba(0,0,0,0.3)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>Pulse of Mind</h1>
        <p style={{
          fontSize: "16px",
          color: "rgba(255,255,255,0.95)",
          maxWidth: "600px",
          lineHeight: "1.6",
          fontWeight: "300"
        }}>Your comprehensive guide to managing stress and improving well-being</p>
      </header>

      <div className="home-buttons" style={{
        display: "flex",
        flexDirection: "column",
        gap: "25px",
        width: "100%",
        maxWidth: "350px",
        position: "relative",
        zIndex: 2
      }}>
        {/* Register Button - This is the first and primary button */}
        <button
          onClick={() => navigate("/register")}
          style={{
            padding: "18px 30px",
            borderRadius: "12px",
            border: "none",
            background: "white",
            color: "#667eea",
            cursor: "pointer",
            fontSize: "20px",
            fontWeight: "600",
            boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease",
            width: "100%",
            letterSpacing: "0.5px"
          }}
          onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          Create Account
        </button>
        
        {/* Login Button */}
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "18px 30px",
            borderRadius: "12px",
            border: "2px solid white",
            background: "transparent",
            color: "white",
            cursor: "pointer",
            fontSize: "20px",
            fontWeight: "600",
            transition: "all 0.3s ease",
            width: "100%",
            letterSpacing: "0.5px"
          }}
          onMouseEnter={(e) => e.target.style.background = 'white'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          Sign In
        </button>
      </div>

      {/* Additional decorative elements */}
      <div style={{
        position: "absolute",
        top: "20%",
        right: "20%",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.05)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
      }}></div>
      
      <div style={{
        position: "absolute",
        bottom: "25%",
        left: "20%",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.05)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
      }}></div>
    </div>
  );
}

export default Home;