const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getHeaders(customHeaders = {}, isFormData = false) {
    const headers = { ...customHeaders };
    const token = localStorage.getItem('shagun_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (!isFormData && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const isFormData = options.body instanceof FormData;
    const config = {
      ...options,
      headers: this.getHeaders(options.headers, isFormData),
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401 && endpoint.includes('/auth/me')) {
          localStorage.removeItem('shagun_token');
        }
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      if (!endpoint.includes('/auth/me')) {
        console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error.message);
      }
      throw error;
    }
  }

  get(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'GET', headers });
  }

  post(endpoint, body, headers = {}) {
    const isFormData = body instanceof FormData;
    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  put(endpoint, body, headers = {}) {
    const isFormData = body instanceof FormData;
    return this.request(endpoint, {
      method: 'PUT',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  delete(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'DELETE', headers });
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
