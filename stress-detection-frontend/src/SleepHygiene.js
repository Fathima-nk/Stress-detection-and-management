import React, { useState } from "react";
import Navigation from './Navigation';

export default function SleepHygiene() {
  const tips = [
    {
      title: "Maintain a Consistent Sleep Schedule",
      description: "Go to bed and wake up at the same time every day, even on weekends. This helps regulate your body's internal clock.",
      icon: "⏰",
      color: "#667eea"
    },
    {
      title: "Create a Relaxing Bedtime Routine",
      description: "Engage in calming activities before bed such as reading, taking a warm bath, or practicing gentle stretches.",
      icon: "🛁",
      color: "#4caf50"
    },
    {
      title: "Optimize Your Sleep Environment",
      description: "Keep your bedroom cool, dark, and quiet. Invest in comfortable bedding and consider using blackout curtains or a white noise machine.",
      icon: "bedroom-night:",
      color: "#ff9800"
    },
    {
      title: "Limit Screen Time Before Bed",
      description: "Avoid phones, tablets, and computers for at least an hour before bedtime. The blue light can interfere with melatonin production.",
      icon: "📱",
      color: "#9c27b0"
    },
    {
      title: "Watch Your Food and Drink Intake",
      description: "Avoid large meals, caffeine, and alcohol close to bedtime. These can disrupt your sleep quality.",
      icon: "🍽️",
      color: "#ff5722"
    },
    {
      title: "Get Regular Exercise",
      description: "Regular physical activity can help you fall asleep faster and enjoy deeper sleep. However, avoid vigorous exercise close to bedtime.",
      icon: "🏃",
      color: "#00bcd4"
    }
  ];

  const warningSigns = [
    "Difficulty falling asleep most nights",
    "Frequent awakenings during the night",
    "Waking up too early and unable to go back to sleep",
    "Feeling tired after a full night's sleep",
    "Daytime fatigue, irritability, or difficulty concentrating"
  ];

  const [expandedTip, setExpandedTip] = useState(null);

  const toggleTip = (index) => {
    setExpandedTip(expandedTip === index ? null : index);
  };

  return (
    <div style={{...styles.container, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}}>
      <Navigation />
      <div style={styles.header}>
        <h1 style={styles.title}>🛌 Sleep Hygiene</h1>
        <p style={styles.subtitle}>Improve your sleep quality for better stress management</p>
      </div>
      
      <div style={styles.content}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Essential Sleep Hygiene Tips</h2>
          <div style={styles.tipsContainer}>
            {tips.map((tip, index) => (
              <div 
                key={index} 
                style={{...styles.tipCard, borderLeft: `5px solid ${tip.color}`}}
                onClick={() => toggleTip(index)}
              >
                <div style={styles.tipHeader}>
                  <span style={styles.tipIcon}>{tip.icon}</span>
                  <h3 style={{...styles.tipTitle, color: tip.color}}>{tip.title}</h3>
                  <span style={styles.expandIcon}>
                    {expandedTip === index ? '−' : '+'}
                  </span>
                </div>
                
                <div style={{
                  ...styles.tipDescription,
                  maxHeight: expandedTip === index ? '200px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease'
                }}>
                  <p style={styles.descriptionText}>{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Warning Signs of Sleep Problems</h2>
          <ul style={styles.warningList}>
            {warningSigns.map((sign, index) => (
              <li key={index} style={styles.warningItem}>
                <span style={styles.warningBullet}>⚠️</span>
                {sign}
              </li>
            ))}
          </ul>
          
          <div style={styles.note}>
            <strong>Note:</strong> If you experience persistent sleep problems despite good sleep hygiene, consider consulting a healthcare professional.
          </div>
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
  tipsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  tipCard: {
    background: "#f8f9fa",
    borderRadius: "8px",
    border: "1px solid #eee",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  tipHeader: {
    display: "flex",
    alignItems: "center",
    padding: "20px",
    position: "relative"
  },
  tipIcon: {
    fontSize: "28px",
    marginRight: "15px"
  },
  tipTitle: {
    fontSize: "20px",
    fontWeight: "600",
    margin: 0,
    flex: 1
  },
  expandIcon: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#667eea"
  },
  tipDescription: {
    transition: "max-height 0.3s ease"
  },
  descriptionText: {
    fontSize: "16px",
    color: "#666",
    lineHeight: "1.6",
    padding: "0 20px 20px 63px",
    margin: 0
  },
  warningList: {
    listStyleType: "none",
    padding: 0
  },
  warningItem: {
    fontSize: "16px",
    color: "#666",
    padding: "12px 0",
    borderBottom: "1px solid #eee",
    display: "flex",
    alignItems: "center"
  },
  warningBullet: {
    marginRight: "15px"
  },
  note: {
    marginTop: "20px",
    padding: "15px",
    background: "#fff8e1",
    borderRadius: "8px",
    border: "1px solid #ffd54f",
    fontSize: "14px",
    color: "#333"
  }
};