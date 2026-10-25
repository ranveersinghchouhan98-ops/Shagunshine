import { handleMockRequest } from './mockData';

const API_BASE_URL = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

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

    let response;
    let data;
    try {
      response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        throw new Error('Received HTML response instead of JSON API');
      }
      data = await response.json().catch(() => ({}));
    } catch (networkError) {
      if (!options.method || options.method === 'GET') {
        if (!endpoint.includes('/auth/me')) {
          console.warn(`[Backend Offline Fallback] Serving mock data for: GET ${endpoint}`);
        }
        return handleMockRequest(endpoint, 'GET', options.body);
      }
      throw new Error(networkError.message || 'Cannot reach backend server. Please verify your connection.');
    }

    if (!response.ok) {
      if (response.status === 401 && endpoint.includes('/auth/me')) {
        localStorage.removeItem('shagun_token');
      }
      if (!options.method || options.method === 'GET') {
        return handleMockRequest(endpoint, 'GET', options.body);
      }
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    if (!options.method || options.method === 'GET') {
      if (!data || !data.success) {
        return handleMockRequest(endpoint, 'GET', options.body);
      }
    }

    return data;
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
