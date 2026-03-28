import React, { useState, useEffect } from "react";
import Navigation from './Navigation';
import { getJournalEntries, addJournalEntry, deleteJournalEntry } from './api';

export default function DailyJournal() {
  // Get current month and year
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [journalEntries, setJournalEntries] = useState({});
  const [newEntryText, setNewEntryText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load entries from database when component mounts
  useEffect(() => {
    loadJournalEntries();
  }, []);

  const loadJournalEntries = async () => {
    try {
      setLoading(true);
      const data = await getJournalEntries();
      setJournalEntries(data);
    } catch (err) {
      console.error('Failed to load journal entries:', err.message);
      setError('Failed to load journal entries. Please ensure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  // Format date as YYYY-MM-DD
  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Check if a date has entries
  const hasEntries = (year, month, day) => {
    const dateKey = formatDate(year, month, day);
    return journalEntries[dateKey] && journalEntries[dateKey].length > 0;
  };

  // Handle day click
  const handleDayClick = (day) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    setSelectedDate({ year, month, day });
    setNewEntryText("");
  };

  // Add new entry
  const handleAddEntry = async () => {
    if (!newEntryText.trim() || !selectedDate) return;

    const dateKey = formatDate(selectedDate.year, selectedDate.month, selectedDate.day);
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    try {
      setLoading(true);
      const response = await addJournalEntry(dateKey, newEntryText, currentTime);
      
      // Update local state with new entry
      setJournalEntries(prev => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), response.entry]
      }));

      setNewEntryText("");
    } catch (err) {
      console.error('Failed to add entry:', err.message);
      setError('Failed to add entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete entry
  const handleDeleteEntry = async (dateKey, entryId) => {
    try {
      setLoading(true);
      await deleteJournalEntry(entryId);
      
      // Update local state
      setJournalEntries(prev => ({
        ...prev,
        [dateKey]: prev[dateKey].filter(entry => entry.id !== entryId)
      }));
    } catch (err) {
      console.error('Failed to delete entry:', err.message);
      setError('Failed to delete entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate({
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate()
    });
  };

  // Render calendar
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={styles.emptyDay}></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate && 
                        selectedDate.year === year && 
                        selectedDate.month === month && 
                        selectedDate.day === day;
      const isToday = new Date().getFullYear() === year &&
                     new Date().getMonth() === month &&
                     new Date().getDate() === day;
      const hasEntry = hasEntries(year, month, day);

      days.push(
        <div
          key={day}
          style={{
            ...styles.day,
            ...(isSelected ? styles.selectedDay : {}),
            ...(isToday ? styles.today : {})
          }}
          onClick={() => handleDayClick(day)}
        >
          <span style={styles.dayNumber}>{day}</span>
          {hasEntry && <span style={styles.tickMark}>✓</span>}
        </div>
      );
    }

    return days;
  };

  // Get entries for selected date
  const getSelectedDateEntries = () => {
    if (!selectedDate) return [];
    const dateKey = formatDate(selectedDate.year, selectedDate.month, selectedDate.day);
    return journalEntries[dateKey] || [];
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const selectedDateString = selectedDate
    ? `${monthNames[selectedDate.month]} ${selectedDate.day}, ${selectedDate.year}`
    : null;

  return (
    <div style={{...styles.container, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}}>
      <Navigation />
      <div style={styles.header}>
        <h1 style={styles.title}>📝 Monthly Journal</h1>
        <p style={styles.subtitle}>Track your daily thoughts and wellness journey</p>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorMessage}>
          <p>{error}</p>
          <button onClick={() => setError(null)} style={styles.dismissButton}>Dismiss</button>
        </div>
      )}
      
      <div style={styles.mainContainer}>
        {/* Calendar Section */}
        <div style={styles.calendarSection}>
          {/* Month Navigation */}
          <div style={styles.monthNavigation}>
            <button style={styles.navButton} onClick={goToPreviousMonth}>‹</button>
            <h2 style={styles.monthTitle}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button style={styles.navButton} onClick={goToNextMonth}>›</button>
          </div>

          <button style={styles.todayButton} onClick={goToToday}>
            Today
          </button>

          {/* Weekday Headers */}
          <div style={styles.weekdayHeader}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={styles.weekday}>{day}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={styles.calendarGrid}>
            {renderCalendar()}
          </div>
        </div>

        {/* Journal Entry Section */}
        {selectedDate && (
          <div style={styles.entrySection}>
            <h3 style={styles.entrySectionTitle}>
              Journal for {selectedDateString}
            </h3>

            {/* Add New Entry */}
            <div style={styles.newEntryForm}>
              <textarea
                style={styles.textarea}
                placeholder="Write your thoughts, feelings, or reflections for this day..."
                value={newEntryText}
                onChange={(e) => setNewEntryText(e.target.value)}
                rows="4"
              />
              <button 
                style={styles.addButton}
                onClick={handleAddEntry}
                disabled={!newEntryText.trim()}
              >
                Add Entry
              </button>
            </div>

            {/* Display Entries */}
            <div style={styles.entriesList}>
              <h4 style={styles.entriesListTitle}>
                Entries ({getSelectedDateEntries().length})
              </h4>
              {getSelectedDateEntries().length === 0 ? (
                <p style={styles.noEntries}>No entries for this day yet. Start writing!</p>
              ) : (
                getSelectedDateEntries().map(entry => (
                  <div key={entry.id} style={styles.entryCard}>
                    <div style={styles.entryHeader}>
                      <span style={styles.entryTime}>{entry.timestamp}</span>
                      <button
                        style={styles.deleteButton}
                        onClick={() => handleDeleteEntry(
                          formatDate(selectedDate.year, selectedDate.month, selectedDate.day),
                          entry.id
                        )}
                      >
                        🗑️
                      </button>
                    </div>
                    <p style={styles.entryText}>{entry.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {!selectedDate && (
          <div style={styles.placeholderSection}>
            <div style={styles.placeholderContent}>
              <span style={styles.placeholderIcon}>📅</span>
              <h3 style={styles.placeholderTitle}>Select a day to view or add journal entries</h3>
              <p style={styles.placeholderText}>
                Click on any date in the calendar to start journaling.
                Days with entries are marked with a ✓
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    paddingBottom: "40px"
  },
  header: {
    textAlign: "center",
    padding: "30px 0 20px",
    maxWidth: "1200px",
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
    marginBottom: "20px"
  },
  mainContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "25px",
    alignItems: "start"
  },
  calendarSection: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255,255,255,0.3)"
  },
  monthNavigation: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px"
  },
  navButton: {
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    width: "40px",
    height: "40px",
    fontSize: "24px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.2s"
  },
  monthTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    margin: 0
  },
  todayButton: {
    background: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "8px 20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "15px",
    width: "100%"
  },
  weekdayHeader: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "5px",
    marginBottom: "10px"
  },
  weekday: {
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "600",
    color: "#667eea",
    padding: "8px 0"
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "8px"
  },
  day: {
    position: "relative",
    aspectRatio: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8f9fa",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "2px solid transparent",
    padding: "8px"
  },
  emptyDay: {
    aspectRatio: "1"
  },
  dayNumber: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333"
  },
  tickMark: {
    position: "absolute",
    top: "4px",
    right: "6px",
    fontSize: "12px",
    color: "#4caf50",
    fontWeight: "bold"
  },
  selectedDay: {
    background: "#667eea",
    border: "2px solid #764ba2",
    transform: "scale(1.05)",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)"
  },
  today: {
    border: "2px solid #ff9800"
  },
  entrySection: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255,255,255,0.3)",
    maxHeight: "600px",
    overflow: "auto"
  },
  entrySectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
    marginTop: 0
  },
  newEntryForm: {
    marginBottom: "25px"
  },
  textarea: {
    width: "100%",
    padding: "12px 15px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    fontFamily: "inherit",
    marginBottom: "10px",
    resize: "vertical"
  },
  addButton: {
    padding: "10px 20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    color: "white",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%"
  },
  entriesList: {
    marginTop: "20px"
  },
  entriesListTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#666",
    marginBottom: "15px",
    marginTop: 0
  },
  noEntries: {
    fontSize: "14px",
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    padding: "20px"
  },
  entryCard: {
    background: "#f8f9fa",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "12px",
    border: "1px solid #e0e0e0"
  },
  entryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
  },
  entryTime: {
    fontSize: "13px",
    color: "#667eea",
    fontWeight: "600"
  },
  deleteButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px 8px"
  },
  entryText: {
    fontSize: "15px",
    color: "#555",
    lineHeight: "1.6",
    margin: 0,
    whiteSpace: "pre-wrap"
  },
  placeholderSection: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "15px",
    padding: "60px 25px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255,255,255,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  placeholderContent: {
    textAlign: "center",
    maxWidth: "400px"
  },
  placeholderIcon: {
    fontSize: "64px",
    marginBottom: "20px",
    display: "block"
  },
  placeholderTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "15px",
    marginTop: 0
  },
  placeholderText: {
    fontSize: "15px",
    color: "#666",
    lineHeight: "1.6",
    margin: 0
  },
  errorMessage: {
    maxWidth: "1200px",
    margin: "0 auto 20px",
    padding: "15px 20px",
    background: "rgba(244, 67, 54, 0.1)",
    border: "1px solid #f44336",
    borderRadius: "8px",
    color: "#c62828",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  dismissButton: {
    background: "transparent",
    border: "1px solid #c62828",
    color: "#c62828",
    padding: "5px 15px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px"
  }
};