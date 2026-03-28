// Home.js
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

/*
  Cleaned Home.js (single-file).
  - No Firebase / Firestore
  - Local navigation via `view` state
  - Prediction form fixed and robust
  - Quotes uses GEMINI_API_URL (API_KEY required to work)
*/

/* ------------------ Configuration ------------------ */
const PREDICTION_API_URL = 'http://127.0.0.1:5000/predict';
const API_KEY = ''; // Optional: add your Gemini API key to enable Quotes
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

/* ------------------ Small UI helpers ------------------ */
const Header = ({ title, onNavigate }) => (
  <header className="bg-indigo-600 shadow-lg text-white p-4 flex justify-between items-center rounded-t-xl">
    <div className="flex items-center space-x-4">
      <h1
        className="text-xl font-bold cursor-pointer hover:text-indigo-200 transition"
        onClick={() => onNavigate('Home')}
      >
        {title}
      </h1>
    </div>
    <div className="flex items-center space-x-3">
      <button
        onClick={() => onNavigate('Home')}
        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded"
      >
        Home
      </button>
    </div>
  </header>
);

const Card = ({ children, className = '', onClick }) => (
  <div
    className={`bg-white p-6 shadow-xl rounded-xl ${className} cursor-pointer`}
    onClick={onClick}
  >
    {children}
  </div>
);

const LoadingIndicator = () => (
  <div className="flex justify-center items-center h-32">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500" />
  </div>
);

/* ------------------ Home (Feature Hub) ------------------ */
const HomeView = ({ onNavigate, journalCount = 0, lastPrediction = 'N/A' }) => {
  const cards = [
    { name: 'Prediction Tool', view: 'Prediction', icon: '🧠', description: 'Predict stress level from lifestyle data.' },
    { name: 'Journal Entry', view: 'Journal', icon: '✍️', description: `Write and save daily reflections (${journalCount} entries).` },
    { name: 'Dashboard & Summary', view: 'Dashboard', icon: '📊', description: `View summary. Last Prediction: ${lastPrediction}` },
    { name: 'Motivational Quotes', view: 'Quotes', icon: '🌟', description: 'Generate a short personalized quote.' },
    { name: 'Relaxation Guide', view: 'Relaxation', icon: '🧘', description: 'Quick techniques for immediate relief.' },
    { name: 'Study & Time Management', view: 'TimeManagement', icon: '⏳', description: 'Pomodoro, prioritization tips.' },
    { name: 'Nutrition for Focus', view: 'Nutrition', icon: '🍎', description: 'Foods & hydration for cognitive function.' },
    { name: 'Sleep Hygiene Deep Dive', view: 'SleepHygiene', icon: '🛌', description: 'Routines and environment for better sleep.' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Feature Hub</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(card => (
          <Card
            key={card.view}
            className="hover:shadow-2xl hover:border-indigo-400 border-2 border-transparent transition duration-300"
            onClick={() => onNavigate(card.view)}
          >
            <div className="text-4xl mb-4">{card.icon}</div>
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">{card.name}</h3>
            <p className="text-gray-600 text-sm">{card.description}</p>
            <div className="mt-4">
              <button className="text-sm font-medium text-indigo-500 hover:text-indigo-700">Open &rarr;</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

/* ------------------ Prediction Component (clean, corrected) ------------------ */
const Prediction = ({ onSavePrediction }) => {
  const [formData, setFormData] = useState({
    Study_Hours_Per_Day: 7.0,
    Extracurricular_Hours_Per_Day: 2.0,
    Sleep_Hours_Per_Day: 7.5,
    Social_Hours_Per_Day: 2.5,
    Physical_Activity_Hours_Per_Day: 1.0,
    GPA: 3.0,
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Keep numeric values; allow empty string if cleared
    setFormData(prev => ({ ...prev, [name]: value === '' ? '' : parseFloat(value) }));
  };

  const validateForm = (data) => {
    const keys = [
      'Study_Hours_Per_Day',
      'Extracurricular_Hours_Per_Day',
      'Sleep_Hours_Per_Day',
      'Social_Hours_Per_Day',
      'Physical_Activity_Hours_Per_Day',
    ];
    const total = keys.reduce((s, k) => s + (parseFloat(data[k]) || 0), 0);
    if (total > 24) return { ok: false, message: 'Sum of daily hours cannot exceed 24.' };
    if (data.GPA < 0 || data.GPA > 4) return { ok: false, message: 'GPA must be between 0.0 and 4.0.' };
    return { ok: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    setError(null);

    // Build requestData using correct property names
    const requestData = {
      Study_Hours_Per_Day: Number(formData.Study_Hours_Per_Day) || 0,
      Extracurricular_Hours_Per_Day: Number(formData.Extracurricular_Hours_Per_Day) || 0,
      Sleep_Hours_Per_Day: Number(formData.Sleep_Hours_Per_Day) || 0,
      Social_Hours_Per_Day: Number(formData.Social_Hours_Per_Day) || 0,
      Physical_Activity_Hours_Per_Day: Number(formData.Physical_Activity_Hours_Per_Day) || 0,
      GPA: Number(formData.GPA) || 0,
    };

    const valid = validateForm(requestData);
    if (!valid.ok) {
      setError(valid.message);
      setLoading(false);
      return;
    }

    try {
      const resp = await fetch(PREDICTION_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!resp.ok) {
        let errorText = resp.statusText;
        try {
          const j = await resp.json();
          if (j && j.error) errorText = j.error;
        } catch (e) {
          // ignore
        }
        throw new Error(`HTTP ${resp.status}: ${errorText}`);
      }

      const data = await resp.json();
      const level = (data.stress_level || data.prediction || 'Unknown').toString();
      setPrediction(level);
      if (onSavePrediction) onSavePrediction({ lastPrediction: level, lastPredictionDate: new Date().toISOString() });
    } catch (err) {
      console.error('Prediction error:', err);
      setError(`Could not fetch prediction. Details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getResultStyle = (level) => {
    const l = (level || '').toLowerCase();
    if (l === 'high') return { backgroundColor: '#f05454', color: '#fff' };
    if (l === 'moderate') return { backgroundColor: '#f9c449', color: '#000' };
    if (l === 'low') return { backgroundColor: '#4caf50', color: '#fff' };
    return { backgroundColor: '#cccccc', color: '#000' };
  };

  const InputField = ({ label, name, value, min = 0, max = 24, step = 0.1 }) => (
    <div className="input-group mb-4">
      <label htmlFor={name} className="block font-medium mb-1">{label}</label>
      <input
        id={name}
        name={name}
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        className="w-full p-3 border rounded"
        required
      />
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto mt-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">🧠 Stress Level Prediction Tool</h2>
        <p className="text-gray-600 mb-6">Enter the student's current lifestyle data to get an instant prediction.</p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Study Hours Per Day" name="Study_Hours_Per_Day" value={formData.Study_Hours_Per_Day} min={0} max={24} step={0.1} />
            <InputField label="Extracurricular Hours Per Day" name="Extracurricular_Hours_Per_Day" value={formData.Extracurricular_Hours_Per_Day} min={0} max={24} step={0.1} />
            <InputField label="Sleep Hours Per Day" name="Sleep_Hours_Per_Day" value={formData.Sleep_Hours_Per_Day} min={0} max={24} step={0.1} />
            <InputField label="Social Hours Per Day" name="Social_Hours_Per_Day" value={formData.Social_Hours_Per_Day} min={0} max={24} step={0.1} />
            <InputField label="Physical Activity Hours Per Day" name="Physical_Activity_Hours_Per_Day" value={formData.Physical_Activity_Hours_Per_Day} min={0} max={24} step={0.1} />
            <div className="mb-4">
              <label htmlFor="GPA" className="block font-medium mb-1">GPA (0.0 to 4.0)</label>
              <input
                id="GPA"
                name="GPA"
                type="number"
                value={formData.GPA}
                min="0"
                max="4.0"
                step="0.01"
                onChange={handleChange}
                className="w-full p-3 border rounded"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? 'Predicting...' : 'Predict Stress Level'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {prediction && (
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Result</h3>
            <div style={getResultStyle(prediction)} className="inline-block py-3 px-6 rounded-full font-bold text-xl">
              {String(prediction).toUpperCase()}
            </div>
            <p className="mt-3 text-gray-700 italic">
              {String(prediction).toLowerCase() === 'high'
                ? '🚨 High stress detected — consider reducing load and improving sleep.'
                : String(prediction).toLowerCase() === 'moderate'
                ? '⚠️ Moderate stress — encourage balance and monitoring.'
                : '✅ Low stress — maintain healthy habits.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------ Journal (local, simple) ------------------ */
const Journal = () => {
  const [entryText, setEntryText] = useState('');
  const [entries, setEntries] = useState([]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!entryText.trim()) return;
    setEntries(prev => [{ id: Date.now(), date: new Date().toLocaleDateString(), text: entryText.trim() }, ...prev]);
    setEntryText('');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">✍️ Daily Journal</h2>
        <form onSubmit={handleSave} className="mb-6">
          <textarea
            rows="5"
            value={entryText}
            onChange={(e) => setEntryText(e.target.value)}
            placeholder="Write about your day..."
            className="w-full p-3 border rounded mb-3"
          />
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">Save Entry</button>
        </form>

        <h3 className="text-lg font-semibold mb-2">Past Entries ({entries.length})</h3>
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {entries.length === 0 && <p className="text-gray-500 italic">No entries yet.</p>}
          {entries.map(en => (
            <div key={en.id} className="p-4 bg-gray-50 border rounded">
              <p className="text-sm text-gray-600 mb-2">{en.date}</p>
              <p className="whitespace-pre-wrap">{en.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ------------------ Quotes (uses Gemini if configured) ------------------ */
const QuotesPage = () => {
  const [prompt, setPrompt] = useState('a quote for a student feeling overwhelmed by exams');
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateQuote = useCallback(async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setQuote(null);
    setError(null);

    // If no API key, generate a simple client-side fallback
    if (!API_KEY) {
      // Very small fallback generator
      setTimeout(() => {
        setQuote('Take one small step — progress compounds.');
        setLoading(false);
      }, 400);
      return;
    }

    const systemPrompt = "You are an inspiring life coach specializing in student wellness. Generate a single, concise motivational quote (max 20 words).";
    const payload = {
      contents: [{ parts: [{ text: `Generate a motivational quote for: ${prompt}` }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    try {
      const resp = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const j = await resp.json();
      const generatedText = j.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText) setQuote(generatedText.trim().replace(/^["']|["']$/g, ''));
      else throw new Error('No text returned');
    } catch (err) {
      console.error('Quote generation failed:', err);
      setError('Failed to generate quote.');
    } finally {
      setLoading(false);
    }
  }, [prompt]);

  useEffect(() => {
    generateQuote();
  }, [generateQuote]);

  return (
    <div className="p-6 max-w-4xl mx-auto mt-6 text-center">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">🌟 Motivational Quote</h2>
        <form onSubmit={generateQuote} className="flex gap-3 mb-6">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 p-3 border rounded"
          />
          <button className="px-4 py-2 bg-green-500 text-white rounded">{loading ? '...' : 'Generate'}</button>
        </form>

        {loading && <LoadingIndicator />}
        {error && <div className="text-red-600">{error}</div>}
        {quote && !loading && (
          <div className="mt-4 p-6 bg-indigo-50 rounded">
            <p className="text-2xl italic">"{quote}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------ Dashboard (local placeholders) ------------------ */
const Dashboard = ({ lastPrediction }) => {
  return (
    <div className="p-6 max-w-4xl mx-auto mt-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">📊 Personal Wellness Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gray-50">
            <p className="text-sm text-gray-600">Last Stress Prediction</p>
            <p className="font-bold text-xl mt-2">{lastPrediction || 'N/A'}</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50">
            <p className="text-sm text-gray-600">Last Prediction Date</p>
            <p className="font-bold text-xl mt-2">N/A</p>
          </div>
        </div>

        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Weekly Summary (Placeholder)</h3>
          <p className="text-gray-600">This section is a placeholder for analytics and trends.</p>
        </div>
      </div>
    </div>
  );
};

/* ------------------ Relaxation / TimeManagement / Nutrition / Sleep ------------------ */
const RelaxationGuide = () => (
  <div className="p-6 max-w-4xl mx-auto mt-6">
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">🧘 Relaxation Guide</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">4-7-8 Breathing</h3>
          <p className="text-gray-700">Inhale 4, hold 7, exhale 8. Repeat 3 times.</p>
        </div>
        <div>
          <h3 className="font-semibold">Progressive Muscle Relaxation</h3>
          <p className="text-gray-700">Tense groups for 5s, release for 10s. Move up the body.</p>
        </div>
      </div>
    </div>
  </div>
);

const TimeManagementGuide = () => (
  <div className="p-6 max-w-4xl mx-auto mt-6">
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">⏳ Study & Time Management</h2>
      <div>
        <h3 className="font-semibold">Pomodoro</h3>
        <p className="text-gray-700">25 minutes focus, 5 minutes break; long break every 4 cycles.</p>
      </div>
    </div>
  </div>
);

const NutritionGuide = () => (
  <div className="p-6 max-w-4xl mx-auto mt-6">
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">🍎 Nutrition for Focus</h2>
      <p className="text-gray-700">Hydration, fatty fish, nuts/seeds, berries, complex carbs.</p>
    </div>
  </div>
);

const SleepHygieneGuide = () => (
  <div className="p-6 max-w-4xl mx-auto mt-6">
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">🛌 Sleep Hygiene</h2>
      <p className="text-gray-700">Consistent schedule, cool dark room, wind-down routine.</p>
    </div>
  </div>
);

/* ------------------ Main exported component (Home.js) ------------------ */
export default function HomeApp() {
  const [view, setView] = useState('Home');
  const [lastPrediction, setLastPrediction] = useState('N/A');
  const [journalCount, setJournalCount] = useState(0);

  // Save prediction callback (from Prediction component)
  const handleSavePrediction = (payload) => {
    if (!payload) return;
    if (payload.lastPrediction) setLastPrediction(payload.lastPrediction);
    // Optionally set lastPredictionDate in state if needed
  };

  // A small effect to set journalCount from local storage (example)
  useEffect(() => {
    // If you persist journal entries to localStorage later, read them here
    // For now we keep it 0 (or could read from localStorage)
    setJournalCount(0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <Header title="Student Wellness Portal" onNavigate={setView} />

        <main className="bg-white rounded-b-xl shadow-xl min-h-[70vh]">
          {view === 'Home' && <HomeView onNavigate={setView} journalCount={journalCount} lastPrediction={lastPrediction} />}
          {view === 'Prediction' && <Prediction onSavePrediction={handleSavePrediction} />}
          {view === 'Journal' && <Journal />}
          {view === 'Dashboard' && <Dashboard lastPrediction={lastPrediction} />}
          {view === 'Quotes' && <QuotesPage />}
          {view === 'Relaxation' && <RelaxationGuide />}
          {view === 'TimeManagement' && <TimeManagementGuide />}
          {view === 'Nutrition' && <NutritionGuide />}
          {view === 'SleepHygiene' && <SleepHygieneGuide />}

          {/* Fallback */}
          {!['Home','Prediction','Journal','Dashboard','Quotes','Relaxation','TimeManagement','Nutrition','SleepHygiene'].includes(view) && (
            <div className="p-10 text-center">
              <h2 className="text-red-500">404 - Page Not Found</h2>
              <button onClick={() => setView('Home')} className="mt-4 text-indigo-600 underline">Go Home</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
