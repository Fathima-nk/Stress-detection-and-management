import React, { useState, useEffect } from "react";
import Navigation from './Navigation';

export default function MotivationalQuotes() {
  const quotes = [
    {
      text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
      author: "Nelson Mandela"
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney"
    },
    {
      text: "Your time is limited, so don't waste it living someone else's life.",
      author: "Steve Jobs"
    },
    {
      text: "If life were predictable it would cease to be life, and be without flavor.",
      author: "Eleanor Roosevelt"
    },
    {
      text: "Life is what happens when you're busy making other plans.",
      author: "John Lennon"
    },
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt"
    },
    {
      text: "It is during our darkest moments that we must focus to see the light.",
      author: "Aristotle"
    },
    {
      text: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
      author: "Ralph Waldo Emerson"
    }
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setFade(true);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  const handleNextQuote = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
      setFade(true);
    }, 500);
  };

  const handlePrevQuote = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex - 1 + quotes.length) % quotes.length);
      setFade(true);
    }, 500);
  };

  const currentQuote = quotes[currentQuoteIndex];

  return (
    <div style={{...styles.container, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}}>
      <Navigation />
      <div style={styles.header}>
        <h1 style={styles.title}>💭 Motivational Quotes</h1>
        <p style={styles.subtitle}>Get inspired with daily motivation</p>
      </div>
      
      <div style={styles.quoteDisplayContainer}>
        <div style={styles.quoteContainer}>
          <button style={styles.navButton} onClick={handlePrevQuote}>
            &lt;
          </button>
          
          <div style={{...styles.quoteCard, opacity: fade ? 1 : 0, transition: 'opacity 0.5s ease'}}>
            <p style={styles.quoteText}>"{currentQuote.text}"</p>
            <p style={styles.quoteAuthor}>- {currentQuote.author}</p>
          </div>
          
          <button style={styles.navButton} onClick={handleNextQuote}>
            &gt;
          </button>
        </div>
        
        <div style={styles.indicatorContainer}>
          {quotes.map((_, index) => (
            <span 
              key={index} 
              style={{
                ...styles.indicator,
                backgroundColor: index === currentQuoteIndex ? '#667eea' : '#ccc'
              }}
            />
          ))}
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
  quoteDisplayContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "70vh"
  },
  quoteContainer: {
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
  quoteCard: {
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    padding: "40px 30px",
    textAlign: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255,255,255,0.2)",
    flex: 1,
    maxWidth: "700px",
    margin: "0 20px"
  },
  quoteText: {
    fontSize: "28px",
    fontStyle: "italic",
    color: "#333",
    lineHeight: "1.6",
    marginBottom: "25px"
  },
  quoteAuthor: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#667eea"
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
  }
};