import axios from 'axios';
import { Card, CreateCardDto, UpdateCardDto } from '@repo/shared-types';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const cardService = {
  // 获取所有卡片
  async getCards(): Promise<Card[]> {
    const response = await api.get('/cards');
    return response.data.map((card: any) => ({
      ...card,
      config: typeof card.config === 'string' ? JSON.parse(card.config) : card.config,
    }));
  },

  // 获取单个卡片
  async getCard(id: string): Promise<Card> {
    const response = await api.get(`/cards/${id}`);
    return {
      ...response.data,
      config: typeof response.data.config === 'string' 
        ? JSON.parse(response.data.config) 
        : response.data.config,
    };
  },

  // 创建卡片
  async createCard(data: CreateCardDto): Promise<Card> {
    const response = await api.post('/cards', data);
    return {
      ...response.data,
      config: typeof response.data.config === 'string' 
        ? JSON.parse(response.data.config) 
        : response.data.config,
    };
  },

  // 更新卡片
  async updateCard(id: string, data: UpdateCardDto): Promise<Card> {
    const response = await api.patch(`/cards/${id}`, data);
    return {
      ...response.data,
      config: typeof response.data.config === 'string' 
        ? JSON.parse(response.data.config) 
        : response.data.config,
    };
  },

  // 删除卡片
  async deleteCard(id: string): Promise<void> {
    await api.delete(`/cards/${id}`);
  },

  // 更新卡片位置
  async updateCardPositions(cardIds: string[]): Promise<void> {
    await api.patch('/cards/positions/update', cardIds);
  },

  // 获取卡片模板
  async getTemplates(): Promise<any[]> {
    const response = await api.get('/cards/templates');
    return response.data;
  },

  // 获取默认配置
  async getDefaultConfig(type: string): Promise<any> {
    const response = await api.get(`/cards/default/${type}`);
    return response.data;
  },
}; 