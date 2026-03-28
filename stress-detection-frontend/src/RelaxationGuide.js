import React, { useState, useEffect } from "react";
import Navigation from './Navigation';

export default function RelaxationGuide() {
  const techniques = [
    {
      title: "Deep Breathing",
      description: "Sit comfortably, close your eyes, and breathe slowly and deeply. Inhale for 4 counts, hold for 4, exhale for 6. Repeat for 5-10 minutes.",
      benefits: "Reduces heart rate and blood pressure, promotes relaxation"
    },
    {
      title: "Progressive Muscle Relaxation",
      description: "Starting with your toes, tense and then relax each muscle group in your body for 5 seconds. Work your way up to your head.",
      benefits: "Reduces physical tension and mental stress"
    },
    {
      title: "Mindfulness Meditation",
      description: "Focus on the present moment. Observe your thoughts without judgment. Start with 5-10 minutes daily.",
      benefits: "Improves focus, reduces anxiety and emotional reactivity"
    },
    {
      title: "Guided Imagery",
      description: "Visualize a peaceful scene in detail - the sights, sounds, smells. Engage all your senses in the experience.",
      benefits: "Reduces stress hormones, promotes calmness"
    },
    {
      title: "Body Scan Meditation",
      description: "Lie down comfortably and bring attention to each part of your body, from toes to head, noticing sensations without judgment.",
      benefits: "Increases body awareness, reduces tension"
    },
    {
      title: "Yoga and Stretching",
      description: "Practice gentle yoga poses or stretching exercises to release physical tension and improve flexibility.",
      benefits: "Improves flexibility, reduces muscle tension, promotes mindfulness"
    }
  ];

  const [currentTechniqueIndex, setCurrentTechniqueIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [breathPhase, setBreathPhase] = useState('Inhale');
  const [breathSize, setBreathSize] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentTechniqueIndex((prevIndex) => (prevIndex + 1) % techniques.length);
        setFade(true);
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, [techniques.length]);

  // Breathing exercise animation
  useEffect(() => {
    let timeoutId;
    
    const runBreathingCycle = () => {
      // Inhale phase - 4 seconds
      setBreathPhase('Inhale');
      setBreathSize(200);
      
      timeoutId = setTimeout(() => {
        // Hold phase - 3 seconds
        setBreathPhase('Hold');
        setBreathSize(210);
        
        timeoutId = setTimeout(() => {
          // Exhale phase - 4 seconds
          setBreathPhase('Exhale');
          setBreathSize(100);
          
          timeoutId = setTimeout(() => {
            // Restart cycle
            runBreathingCycle();
          }, 4000);
        }, 3000);
      }, 4000);
    };
    
    // Start with small size then begin cycle
    setBreathSize(100);
    setTimeout(runBreathingCycle, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const handleNextTechnique = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentTechniqueIndex((prevIndex) => (prevIndex + 1) % techniques.length);
      setFade(true);
    }, 500);
  };

  const handlePrevTechnique = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentTechniqueIndex((prevIndex) => (prevIndex - 1 + techniques.length) % techniques.length);
      setFade(true);
    }, 500);
  };

  const currentTechnique = techniques[currentTechniqueIndex];

  return (
    <div style={{...styles.container, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}}>
      <Navigation />
      <div style={styles.header}>
        <h1 style={styles.title}>🧘 Relaxation Guide</h1>
        <p style={styles.subtitle}>Learn techniques to reduce stress and promote well-being</p>
      </div>
      
      <div style={styles.techniqueDisplayContainer}>
        <div style={styles.techniqueContainer}>
          <button style={styles.navButton} onClick={handlePrevTechnique}>
            &lt;
          </button>
          
          <div style={{...styles.techniqueCard, opacity: fade ? 1 : 0, transition: 'opacity 0.5s ease'}}>
            <h3 style={styles.techniqueTitle}>{currentTechnique.title}</h3>
            <p style={styles.techniqueDescription}>{currentTechnique.description}</p>
            <div style={styles.benefitsContainer}>
              <strong>Benefits:</strong>
              <p style={styles.benefitsText}>{currentTechnique.benefits}</p>
            </div>
          </div>
          
          <button style={styles.navButton} onClick={handleNextTechnique}>
            &gt;
          </button>
        </div>
        
        <div style={styles.indicatorContainer}>
          {techniques.map((_, index) => (
            <span 
              key={index} 
              style={{
                ...styles.indicator,
                backgroundColor: index === currentTechniqueIndex ? '#667eea' : '#ccc'
              }}
            />
          ))}
        </div>
      </div>

      {/* Breathing Exercise Section */}
      <div style={styles.breathingSection}>
        <h2 style={styles.breathingSectionTitle}>Guided Breathing Exercise</h2>
        <p style={styles.breathingSectionSubtitle}>Follow the circle and breathe along</p>
        
        <div style={styles.breathingContainer}>
          <div 
            style={{
              ...styles.breathingCircle,
              width: `${breathSize}px`,
              height: `${breathSize}px`,
              transition: breathPhase === 'Inhale' ? 'all 4s ease-in-out' : 
                         breathPhase === 'Hold' ? 'all 3s ease-in-out' : 
                         'all 4s ease-in-out'
            }}
          >
            <span style={styles.breathingText}>{breathPhase}</span>
          </div>
        </div>
        
        <p style={styles.breathingInstruction}>
          {breathPhase === 'Inhale' && 'Breathe in slowly through your nose...'}
          {breathPhase === 'Hold' && 'Hold your breath gently...'}
          {breathPhase === 'Exhale' && 'Breathe out slowly through your mouth...'}
        </p>
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
  techniqueDisplayContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "70vh"
  },
  techniqueContainer: {
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
  techniqueCard: {
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    padding: "40px 30px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255,255,255,0.2)",
    flex: 1,
    maxWidth: "700px",
    margin: "0 20px"
  },
  techniqueTitle: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
    textAlign: "center"
  },
  techniqueDescription: {
    fontSize: "18px",
    color: "#666",
    lineHeight: "1.6",
    marginBottom: "25px"
  },
  benefitsContainer: {
    borderTop: "1px solid #eee",
    paddingTop: "20px"
  },
  benefitsText: {
    fontSize: "16px",
    color: "#4caf50",
    marginTop: "10px",
    lineHeight: "1.5"
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
  breathingSection: {
    maxWidth: "800px",
    margin: "60px auto 40px",
    padding: "40px 20px",
    textAlign: "center"
  },
  breathingSectionTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "white",
    marginBottom: "10px",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)"
  },
  breathingSectionSubtitle: {
    fontSize: "16px",
    color: "rgba(255,255,255,0.9)",
    marginBottom: "40px"
  },
  breathingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "300px",
    margin: "30px 0"
  },
  breathingCircle: {
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(102,126,234,0.8) 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
    border: "3px solid rgba(255,255,255,0.9)"
  },
  breathingText: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#667eea",
    textShadow: "0 1px 2px rgba(255,255,255,0.8)"
  },
  breathingInstruction: {
    fontSize: "18px",
    color: "white",
    fontWeight: "500",
    marginTop: "20px",
    minHeight: "30px",
    textShadow: "0 1px 3px rgba(0,0,0,0.3)"
  }
};