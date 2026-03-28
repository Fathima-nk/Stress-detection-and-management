// API Service for communicating with Flask backend

const API_BASE_URL = 'http://127.0.0.1:5000';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// ==================== Authentication ====================

export const register = async (email, password, fullName) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      full_name: fullName
    })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }
  
  // Store token and user info
  localStorage.setItem('authToken', data.access_token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data;
};

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }
  
  // Store token and user info
  localStorage.setItem('authToken', data.access_token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data;
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('stressPrediction'); // Clear cached prediction
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// ==================== Journal Entries ====================

export const getJournalEntries = async () => {
  const response = await fetch(`${API_BASE_URL}/journal/entries`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch journal entries');
  }
  
  return data;
};

export const addJournalEntry = async (entryDate, entryText, entryTime) => {
  const response = await fetch(`${API_BASE_URL}/journal/entries`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      entry_date: entryDate,
      entry_text: entryText,
      entry_time: entryTime
    })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to add journal entry');
  }
  
  return data;
};

export const deleteJournalEntry = async (entryId) => {
  const response = await fetch(`${API_BASE_URL}/journal/entries/${entryId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete journal entry');
  }
  
  return data;
};

// ==================== Stress Predictions ====================

export const predictStress = async (formData) => {
  const token = getAuthToken();
  
  // Only include Authorization header if token exists and is valid
  const headers = { 'Content-Type': 'application/json' };
  if (token && token !== 'null' && token !== 'undefined' && token.length > 0) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(formData)
  });
  
  // Try to parse response as JSON
  let data;
  try {
    data = await response.json();
  } catch (e) {
    throw new Error('Server returned invalid response');
  }
  
  if (!response.ok) {
    // If 422 error, it might be token issue - clear it and retry
    if (response.status === 422 && headers['Authorization']) {
      console.log('Token might be invalid, clearing and retrying...');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Retry without token
      const retryResponse = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const retryData = await retryResponse.json();
      if (!retryResponse.ok) {
        throw new Error(retryData.error || retryData.details || 'Prediction failed');
      }
      return retryData;
    }
    throw new Error(data.error || data.details || 'Prediction failed');
  }
  
  return data;
};

export const getPredictionHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/predictions/history`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch prediction history');
  }
  
  return data;
};

export const getLatestPrediction = async () => {
  const token = getAuthToken();
  
  // Only try to fetch if user is authenticated
  if (!token || token === 'null' || token === 'undefined') {
    return { stress_level: null };
  }
  
  const response = await fetch(`${API_BASE_URL}/predictions/latest`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch latest prediction');
  }
  
  return data;
};
