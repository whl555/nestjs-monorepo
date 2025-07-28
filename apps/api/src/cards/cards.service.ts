import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaApi } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { GetCardsFilterDto } from './dto/get-cards-filter.dto';
import { Card, CardType } from '@prisma/client';

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaApi) {}

  async getAllCards(): Promise<Card[]> {
    return await this.prisma.card.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' },
    });
  }

  async getCardsWithFilters(filterDto: GetCardsFilterDto): Promise<Card[]> {
    const { type, isActive, userId, search, page = 1, limit = 10 } = filterDto;
    
    const where: any = {};
    
    if (type) where.type = type;
    if (isActive !== undefined) where.isActive = isActive;
    if (userId) where.userId = userId;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    return await this.prisma.card.findMany({
      where,
      orderBy: { position: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getCardById(id: string): Promise<Card> {
    const card = await this.prisma.card.findUnique({
      where: { id },
    });

    if (!card) {
      throw new NotFoundException(`Card with ID "${id}" not found`);
    }

    return card;
  }

  async createCard(dto: CreateCardDto): Promise<Card> {
    // 如果没有指定位置，设置为最后
    if (dto.position === undefined) {
      const lastCard = await this.prisma.card.findFirst({
        orderBy: { position: 'desc' },
      });
      dto.position = lastCard ? lastCard.position + 1 : 0;
    }

    return await this.prisma.card.create({
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type,
        config: JSON.stringify(dto.config),
        position: dto.position,
        userId: dto.userId,
      },
    });
  }

  async updateCard(id: string, dto: UpdateCardDto): Promise<Card> {
    await this.getCardById(id); // 检查卡片是否存在

    const updateData: any = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.type !== undefined) updateData.type = dto.type;
    if (dto.config !== undefined) updateData.config = JSON.stringify(dto.config);
    if (dto.position !== undefined) updateData.position = dto.position;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    return await this.prisma.card.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteCard(id: string): Promise<void> {
    await this.getCardById(id); // 检查卡片是否存在

    await this.prisma.card.delete({
      where: { id },
    });
  }

  async updateCardPositions(cardIds: string[]): Promise<void> {
    // 批量更新卡片位置
    const updates = cardIds.map((id, index) =>
      this.prisma.card.update({
        where: { id },
        data: { position: index },
      })
    );

    await Promise.all(updates);
  }

  async getCardTemplates(): Promise<any[]> {
    return await this.prisma.cardTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCardFromTemplate(templateId: string, customConfig?: any): Promise<Card> {
    const template = await this.prisma.cardTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID "${templateId}" not found`);
    }

    const config = customConfig || JSON.parse(template.defaultConfig);
    
    return await this.createCard({
      title: template.name,
      description: template.description || undefined,
      type: template.type,
      config,
    });
  }

  // 获取默认卡片模板
  async getDefaultCardsByType(type: CardType): Promise<any> {
    const defaultConfigs = {
      [CardType.TEXT]: {
        text: {
          content: '这是一个文本卡片',
          fontSize: 16,
          color: '#333333',
          alignment: 'left',
        },
        style: {
          backgroundColor: '#ffffff',
          borderRadius: 8,
          padding: 16,
          shadow: true,
        },
      },
      [CardType.IMAGE]: {
        image: {
          url: 'https://via.placeholder.com/300x200',
          alt: '示例图片',
          objectFit: 'cover',
        },
        style: {
          borderRadius: 8,
          shadow: true,
        },
      },
      [CardType.LINK]: {
        link: {
          url: 'https://example.com',
          title: '示例链接',
          description: '这是一个链接卡片的描述',
        },
        style: {
          backgroundColor: '#f8f9fa',
          borderRadius: 8,
          padding: 16,
          shadow: true,
        },
      },
      [CardType.STATS]: {
        stats: {
          value: 42,
          label: '统计数据',
          trend: 'up',
          percentage: 15,
        },
        style: {
          backgroundColor: '#e3f2fd',
          borderRadius: 8,
          padding: 16,
          shadow: true,
        },
      },
      [CardType.TODO]: {
        todo: {
          items: [
            { id: '1', text: '完成项目设计', completed: true },
            { id: '2', text: '编写代码', completed: false },
            { id: '3', text: '测试功能', completed: false },
          ],
          showCompleted: true,
        },
        style: {
          backgroundColor: '#fff3e0',
          borderRadius: 8,
          padding: 16,
          shadow: true,
        },
      },
    };

    return defaultConfigs[type] || {};
  }
} 