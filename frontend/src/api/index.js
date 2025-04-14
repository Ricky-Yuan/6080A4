import axios from 'axios';

// 从配置文件读取后端URL
const backendConfig = require('../../backend.config.json');
const BASE_URL = backendConfig.backendUrl;

// 创建axios实例
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient; 