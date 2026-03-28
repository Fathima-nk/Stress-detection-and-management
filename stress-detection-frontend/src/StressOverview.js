import React, { useState } from "react";
import Navigation from './Navigation';

export default function StressOverview() {
  // Sample stress level data - in a real app, this would come from an API
  const [stressData] = useState([
    { date: 'Mon', level: 2 }, // Low
    { date: 'Tue', level: 3 }, // Moderate
    { date: 'Wed', level: 1 }, // Low
    { date: 'Thu', level: 3 }, // Moderate
    { date: 'Fri', level: 4 }, // High
    { date: 'Sat', level: 2 }, // Low
    { date: 'Sun', level: 3 }  // Moderate
  ]);

  // Function to get color based on stress level
  const getBarColor = (level) => {
    if (level <= 2) return '#4caf50'; // Green for low
    if (level <= 3) return '#f9c449'; // Yellow for moderate
    return '#f05454'; // Red for high
  };

  // Function to get label based on stress level
  const getLevelLabel = (level) => {
    if (level <= 2) return 'Low';
    if (level <= 3) return 'Moderate';
    return 'High';
  };

  return (
    <div style={{...styles.container, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}}>
      <Navigation />
      <div style={styles.header}>
        <h1 style={styles.title}>📊 Weekly Stress Level Overview</h1>
        <p style={styles.subtitle}>Track your stress levels throughout the week</p>
      </div>

      {/* Stress Level Graph */}
      <div style={styles.graphContainer}>
        <h2 style={styles.graphTitle}>Your Stress Levels</h2>
        <div style={styles.graph}>
          {stressData.map((data, index) => (
            <div key={index} style={styles.barContainer}>
              <div 
                style={{
                  ...styles.bar,
                  height: `${data.level * 20}%`,
                  backgroundColor: getBarColor(data.level)
                }}
              />
              <div style={styles.barLabel}>{data.date}</div>
              <div style={styles.levelLabel}>{getLevelLabel(data.level)}</div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div style={styles.legendContainer}>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: '#4caf50'}}></div>
            <span style={styles.legendText}>Low Stress</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: '#f9c449'}}></div>
            <span style={styles.legendText}>Moderate Stress</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{...styles.legendColor, backgroundColor: '#f05454'}}></div>
            <span style={styles.legendText}>High Stress</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryContainer}>
        <div style={styles.summaryCard}>
          <h3 style={styles.summaryTitle}>Average Stress Level</h3>
          <p style={styles.summaryValue}>Moderate</p>
        </div>
        <div style={styles.summaryCard}>
          <h3 style={styles.summaryTitle}>Peak Stress Day</h3>
          <p style={styles.summaryValue}>Friday</p>
        </div>
        <div style={styles.summaryCard}>
          <h3 style={styles.summaryTitle}>Low Stress Days</h3>
          <p style={styles.summaryValue}>3 days</p>
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
    fontSize: "36px",
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
    padding: "30px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255,255,255,0.2)",
    maxWidth: "1000px",
    margin: "0 auto 30px",
    position: "relative",
    zIndex: 2
  },
  graphTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "30px",
    textAlign: "center"
  },
  graph: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: "250px",
    padding: "20px 0",
    marginBottom: "30px"
  },
  barContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%"
  },
  bar: {
    width: "50px",
    minWidth: "50px",
    borderRadius: "8px 8px 0 0",
    marginBottom: "10px",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },
  barLabel: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "5px"
  },
  levelLabel: {
    fontSize: "13px",
    color: "#666"
  },
  legendContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "1px solid #eee"
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  legendColor: {
    width: "20px",
    height: "20px",
    borderRadius: "4px"
  },
  legendText: {
    fontSize: "14px",
    color: "#666",
    fontWeight: "500"
  },
  summaryContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    maxWidth: "1000px",
    margin: "0 auto",
    position: "relative",
    zIndex: 2
  },
  summaryCard: {
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    padding: "25px",
    textAlign: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255,255,255,0.2)"
  },
  summaryTitle: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "10px",
    fontWeight: "500"
  },
  summaryValue: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#667eea",
    margin: 0
  }
};
