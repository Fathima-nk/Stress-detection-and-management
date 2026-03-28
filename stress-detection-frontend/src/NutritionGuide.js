import React, { useState } from "react";
import Navigation from './Navigation';

export default function NutritionGuide() {
  const foods = [
    {
      category: "Brain-Boosting Foods",
      items: [
        {
          name: "Blueberries",
          description: "Rich in antioxidants that protect the brain",
          icon: "🫐",
          color: "#667eea"
        },
        {
          name: "Fatty Fish",
          description: "High in omega-3 fatty acids (salmon, sardines)",
          icon: "🐟",
          color: "#4caf50"
        },
        {
          name: "Dark Chocolate",
          description: "Improves blood flow to the brain",
          icon: "🍫",
          color: "#795548"
        },
        {
          name: "Nuts & Seeds",
          description: "Provide vitamin E and healthy fats",
          icon: "🥜",
          color: "#ff9800"
        }
      ]
    },
    {
      category: "Stress-Reducing Foods",
      items: [
        {
          name: "Leafy Greens",
          description: "Rich in magnesium (spinach, kale)",
          icon: "🥬",
          color: "#8bc34a"
        },
        {
          name: "Chamomile Tea",
          description: "Natural calming properties",
          icon: "🍵",
          color: "#cddc39"
        },
        {
          name: "Greek Yogurt",
          description: "Probiotics support gut-brain connection",
          icon: "🥛",
          color: "#ffc107"
        },
        {
          name: "Oatmeal",
          description: "Stabilizes blood sugar and mood",
          icon: "🥣",
          color: "#ff9800"
        }
      ]
    },
    {
      category: "Foods to Avoid",
      items: [
        {
          name: "High-Sugar Snacks",
          description: "Cause energy crashes",
          icon: "🍭",
          color: "#f44336"
        },
        {
          name: "Caffeine",
          description: "Can increase anxiety and disrupt sleep",
          icon: "☕",
          color: "#795548"
        },
        {
          name: "Processed Foods",
          description: "Often lack essential nutrients",
          icon: "🍟",
          color: "#ff5722"
        },
        {
          name: "Alcohol",
          description: "Disrupts sleep and affects mood regulation",
          icon: "🍷",
          color: "#9c27b0"
        }
      ]
    }
  ];

  const tips = [
    "Eat regular meals to maintain stable blood sugar levels",
    "Stay hydrated - even mild dehydration can affect mood and concentration",
    "Include protein in every meal to support neurotransmitter production",
    "Plan and prep meals to reduce decision fatigue"
  ];

  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div style={{...styles.container, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}}>
      <Navigation />
      <div style={styles.header}>
        <h1 style={styles.title}>🍎 Nutrition Guide</h1>
        <p style={styles.subtitle}>Optimize your diet for better focus and stress management</p>
      </div>
      
      <div style={styles.content}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Foods for Brain Health and Stress Management</h2>
          
          {/* Category Tabs */}
          <div style={styles.tabContainer}>
            {foods.map((foodCategory, index) => (
              <button
                key={index}
                style={{
                  ...styles.tab,
                  backgroundColor: activeCategory === index ? '#667eea' : '#f1f1f1',
                  color: activeCategory === index ? 'white' : '#333'
                }}
                onClick={() => setActiveCategory(index)}
              >
                {foodCategory.category}
              </button>
            ))}
          </div>
          
          {/* Food Items Grid */}
          <div style={styles.foodsContainer}>
            {foods[activeCategory].items.map((item, itemIndex) => (
              <div 
                key={itemIndex} 
                style={{...styles.foodCard, borderLeft: `5px solid ${item.color}`}}
              >
                <div style={styles.foodHeader}>
                  <span style={styles.foodIcon}>{item.icon}</span>
                  <h3 style={{...styles.foodTitle, color: item.color}}>{item.name}</h3>
                </div>
                <p style={styles.foodDescription}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Healthy Eating Tips</h2>
          <ul style={styles.tipsList}>
            {tips.map((tip, index) => (
              <li key={index} style={styles.tipItem}>
                <span style={styles.tipBullet}>✓</span>
                {tip}
              </li>
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
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "25px",
    flexWrap: "wrap",
    gap: "10px"
  },
  tab: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.3s ease"
  },
  foodsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px"
  },
  foodCard: {
    background: "#f8f9fa",
    borderRadius: "8px",
    padding: "20px",
    border: "1px solid #eee",
    transition: "transform 0.2s ease, box-shadow 0.2s ease"
  },
  foodHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px"
  },
  foodIcon: {
    fontSize: "28px",
    marginRight: "15px"
  },
  foodTitle: {
    fontSize: "20px",
    fontWeight: "600",
    margin: 0
  },
  foodDescription: {
    fontSize: "16px",
    color: "#666",
    lineHeight: "1.5",
    marginLeft: "43px"
  },
  tipsList: {
    listStyleType: "none",
    padding: 0
  },
  tipItem: {
    fontSize: "16px",
    color: "#666",
    padding: "15px 0",
    borderBottom: "1px solid #eee",
    display: "flex",
    alignItems: "center"
  },
  tipBullet: {
    color: "#4caf50",
    fontWeight: "bold",
    fontSize: "18px",
    marginRight: "15px"
  }
};