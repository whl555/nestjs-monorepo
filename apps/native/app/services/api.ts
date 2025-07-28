import axios from 'axios';
import { Card, CreateCardDto, UpdateCardDto, CardTemplate, CardConfig } from '@repo/shared-types';

// 根据运行环境设置API基础URL
// 在移动端开发时，localhost指向设备本身，需要使用开发机器的IP地址
const getApiBaseUrl = () => {
  if (__DEV__) {
    // 开发环境：使用开发机器的IP地址
    // 注意：如果IP地址变化，需要更新这里
    return 'http://10.1.13.40:3000';
  } else {
    // 生产环境
    return 'https://your-production-api.com';
  }
};

const API_BASE_URL = getApiBaseUrl();

console.log('🔗 移动端API连接地址:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10秒超时
});

// 添加请求拦截器用于调试
api.interceptors.request.use(
  (config) => {
    console.log('📤 API请求:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('📤 API请求错误:', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器用于调试
api.interceptors.response.use(
  (response) => {
    console.log('📥 API响应:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('📥 API响应错误:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('🚨 无法连接到API服务器，请确保：');
      console.error('   1. API服务正在运行 (npm run dev 在api目录)');
      console.error('   2. 网络连接正常');
      console.error('   3. IP地址配置正确 (当前配置:', API_BASE_URL, ')');
    }
    return Promise.reject(error);
  }
);

export const cardService = {
  // 获取所有卡片
  async getCards(): Promise<Card[]> {
    try {
      const response = await api.get('/cards');
      return response.data;
    } catch (error) {
      console.error('获取卡片失败:', error);
      throw error;
    }
  },

  // 获取单个卡片
  async getCard(id: string): Promise<Card> {
    try {
      const response = await api.get(`/cards/${id}`);
      return response.data;
    } catch (error) {
      console.error('获取卡片失败:', error);
      throw error;
    }
  },

  // 创建卡片
  async createCard(data: CreateCardDto): Promise<Card> {
    try {
      const response = await api.post('/cards', data);
      return response.data;
    } catch (error) {
      console.error('创建卡片失败:', error);
      throw error;
    }
  },

  // 更新卡片
  async updateCard(id: string, data: UpdateCardDto): Promise<Card> {
    try {
      const response = await api.patch(`/cards/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('更新卡片失败:', error);
      throw error;
    }
  },

  // 删除卡片
  async deleteCard(id: string): Promise<void> {
    try {
      await api.delete(`/cards/${id}`);
    } catch (error) {
      console.error('删除卡片失败:', error);
      throw error;
    }
  },

  // 更新卡片位置
  async updateCardPositions(cardIds: string[]): Promise<void> {
    try {
      await api.patch('/cards/positions/update', cardIds);
    } catch (error) {
      console.error('更新卡片位置失败:', error);
      throw error;
    }
  },

  // 获取卡片模板
  async getTemplates(): Promise<CardTemplate[]> {
    try {
      const response = await api.get('/cards/templates');
      return response.data;
    } catch (error) {
      console.error('获取模板失败:', error);
      throw error;
    }
  },

  // 获取默认配置
  async getDefaultConfig(type: string): Promise<CardConfig> {
    try {
      const response = await api.get(`/cards/default/${type}`);
      return response.data;
    } catch (error) {
      console.error('获取默认配置失败:', error);
      throw error;
    }
  },
}; 