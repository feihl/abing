const BASE_URL = 'http://192.168.1.6:8000'; // Replace with your backend's IP address

export const api = {
  get: async (endpoint) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('GET request failed:', error);
      return { success: false, error: 'Network error' };
    }
  },
  post: async (endpoint, body) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || JSON.stringify(data) || 'Unknown error');
      }
      return { success: true, data };
    } catch (error) {
      console.error('POST request failed:', error.message || error);
      return { success: false, error: error.message || 'An unknown error occurred' };
    }
  },
  put: async (endpoint, body) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || JSON.stringify(data) || 'Unknown error');
      }
      return { success: true, data };
    } catch (error) {
      console.error('PUT request failed:', error.message || error);
      return { success: false, error: error.message || 'An unknown error occurred' };
    }
  },
  delete: async (endpoint) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || JSON.stringify(data) || 'Unknown error');
      }
      return { success: true, data };
    } catch (error) {
      console.error('DELETE request failed:', error.message || error);
      return { success: false, error: error.message || 'An unknown error occurred' };
    }
  },
};

export default BASE_URL;
