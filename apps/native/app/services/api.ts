import axios from 'axios';
import { Card, CreateCardDto, UpdateCardDto, CardTemplate, CardConfig } from '@repo/shared-types';

// 根据运行环境设置API基础URL
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000'  // 开发环境
  : 'https://your-production-api.com'; // 生产环境

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10秒超时
});

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