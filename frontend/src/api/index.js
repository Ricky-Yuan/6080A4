const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

const apiClient = {
  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = localStorage.getItem('currentUser')
      ? JSON.parse(localStorage.getItem('currentUser')).token
      : null;

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // 对于204状态码（无内容）的响应，直接返回
    if (response.status === 204) {
      return {};
    }

    // 尝试解析JSON响应
    let data;
    try {
      data = await response.json();
    } catch (e) {
      // 如果响应不是JSON格式，返回空对象
      data = {};
    }

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};

export default apiClient; 