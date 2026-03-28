import React, { useState, useEffect } from "react";
import Navigation from './Navigation';

export default function TimeManagement() {
  const tips = [
    {
      title: "Prioritize Tasks",
      description: "Use the Eisenhower Matrix to categorize tasks by urgency and importance. Focus on important and urgent tasks first.",
      example: "Complete assignments due tomorrow before organizing your desk"
    },
    {
      title: "Time Blocking",
      description: "Schedule specific blocks of time for different activities. Include breaks and buffer time between tasks.",
      example: "9-11 AM: Study, 11-11:15 AM: Break, 11:15-12:15 PM: Assignment"
    },
    {
      title: "The Pomodoro Technique",
      description: "Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15-30 minute break.",
      example: "Set a timer for 25 minutes and focus on one task only during that time"
    },
    {
      title: "Avoid Multitasking",
      description: "Focus on one task at a time. Multitasking reduces efficiency and increases stress.",
      example: "Close social media tabs while studying to maintain focus"
    },
    {
      title: "Set SMART Goals",
      description: "Create Specific, Measurable, Achievable, Relevant, and Time-bound goals to stay focused and motivated.",
      example: "Instead of 'study more', try 'study for 2 hours every weekday from 7-9 PM'"
    },
    {
      title: "Use the Two-Minute Rule",
      description: "If a task takes less than two minutes, do it immediately rather than adding it to your to-do list.",
      example: "Reply to a quick email or file a document right away"
    }
  ];

  const tools = [
    "Digital calendars (Google Calendar, Outlook)",
    "Task management apps (Todoist, Trello)",
    "Time tracking tools (RescueTime, Toggl)",
    "Focus apps (Forest, Focus@Will)"
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
        setFade(true);
      }, 500);
    }, 9000);

    return () => clearInterval(interval);
  }, [tips.length]);

  const handleNextTip = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
      setFade(true);
    }, 500);
  };

  const handlePrevTip = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex - 1 + tips.length) % tips.length);
      setFade(true);
    }, 500);
  };

  const currentTip = tips[currentTipIndex];

  return (
    <div style={{...styles.container, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}}>
      <Navigation />
      <div style={styles.header}>
        <h1 style={styles.title}>⏳ Time Management</h1>
        <p style={styles.subtitle}>Improve your productivity and focus</p>
      </div>
      
      <div style={styles.content}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Effective Time Management Tips</h2>
          <div style={styles.tipDisplayContainer}>
            <div style={styles.tipContainer}>
              <button style={styles.navButton} onClick={handlePrevTip}>
                &lt;
              </button>
              
              <div style={{...styles.tipCard, opacity: fade ? 1 : 0, transition: 'opacity 0.5s ease'}}>
                <h3 style={styles.tipTitle}>{currentTip.title}</h3>
                <p style={styles.tipDescription}>{currentTip.description}</p>
                <div style={styles.exampleContainer}>
                  <strong>Example:</strong>
                  <p style={styles.exampleText}>{currentTip.example}</p>
                </div>
              </div>
              
              <button style={styles.navButton} onClick={handleNextTip}>
                &gt;
              </button>
            </div>
            
            <div style={styles.indicatorContainer}>
              {tips.map((_, index) => (
                <span 
                  key={index} 
                  style={{
                    ...styles.indicator,
                    backgroundColor: index === currentTipIndex ? '#667eea' : '#ccc'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Recommended Tools</h2>
          <ul style={styles.toolsList}>
            {tools.map((tool, index) => (
              <li key={index} style={styles.toolItem}>{tool}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px"
  },
  header: {
    textAlign: "center",
    padding: "30px 0",
    maxWidth: "800px",
    margin: "0 auto"
  },
  title: {
    fontSize: "32px",
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
  content: {
    maxWidth: "1000px",
    margin: "0 auto"
  },
  section: {
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255,255,255,0.2)",
    marginBottom: "30px"
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
    textAlign: "center"
  },
  tipDisplayContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  tipContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto"
  },
  navButton: {
    background: "rgba(255, 255, 255, 0.9)",
    border: "none",
    fontSize: "24px",
    padding: "15px 20px",
    borderRadius: "50%",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    margin: "0 20px",
    fontWeight: "bold",
    color: "#667eea"
  },
  tipCard: {
    background: "#f8f9fa",
    borderRadius: "8px",
    padding: "40px 30px",
    border: "1px solid #eee",
    flex: 1,
    maxWidth: "700px",
    margin: "0 20px"
  },
  tipTitle: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
    textAlign: "center"
  },
  tipDescription: {
    fontSize: "18px",
    color: "#666",
    lineHeight: "1.6",
    marginBottom: "25px"
  },
  exampleContainer: {
    borderTop: "1px solid #eee",
    paddingTop: "20px"
  },
  exampleText: {
    fontSize: "16px",
    color: "#667eea",
    fontStyle: "italic",
    margin: "10px 0 0 0"
  },
  indicatorContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px"
  },
  indicator: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    margin: "0 5px",
    transition: "background-color 0.3s ease"
  },
  toolsList: {
    listStyleType: "none",
    padding: 0
  },
  toolItem: {
    fontSize: "16px",
    color: "#666",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
    paddingLeft: "20px",
    position: "relative"
  }
};