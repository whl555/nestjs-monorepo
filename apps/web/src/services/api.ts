import axios from 'axios';
import { Card, CreateCardDto, UpdateCardDto, CardTemplate, CardConfig } from '@repo/shared-types';

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
    return response.data;
  },

  // 获取单个卡片
  async getCard(id: string): Promise<Card> {
    const response = await api.get(`/cards/${id}`);
    return response.data;
  },

  // 创建卡片
  async createCard(data: CreateCardDto): Promise<Card> {
    const response = await api.post('/cards', data);
    return response.data;
  },

  // 更新卡片
  async updateCard(id: string, data: UpdateCardDto): Promise<Card> {
    const response = await api.patch(`/cards/${id}`, data);
    return response.data;
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
  async getTemplates(): Promise<CardTemplate[]> {
    const response = await api.get('/cards/templates');
    return response.data;
  },

  // 获取默认配置
  async getDefaultConfig(type: string): Promise<CardConfig> {
    const response = await api.get(`/cards/default/${type}`);
    return response.data;
  },
}; 