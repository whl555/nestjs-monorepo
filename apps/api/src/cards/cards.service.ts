import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaApi } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { GetCardsFilterDto } from './dto/get-cards-filter.dto';

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaApi) {}

  async getAllCards() {
    return await (this.prisma as any).card.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' },
    });
  }

  async getCardsWithFilters(filterDto: GetCardsFilterDto) {
    const { type, isActive, userId, search, page = 1, limit = 10 } = filterDto;

    const where: Record<string, any> = {};

    if (type) where.type = type;
    if (isActive !== undefined) where.isActive = isActive;
    if (userId) where.userId = userId;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    return await (this.prisma as any).card.findMany({
      where,
      orderBy: { position: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getCardById(id: string) {
    const card = await (this.prisma as any).card.findUnique({
      where: { id },
    });

    if (!card) {
      throw new NotFoundException(`Card with ID "${id}" not found`);
    }

    return card;
  }

  async createCard(dto: CreateCardDto) {
    // 如果没有指定位置，设置为最后
    let position = dto.position;
    if (position === undefined) {
      const lastCard = await (this.prisma as any).card.findFirst({
        orderBy: { position: 'desc' },
      });
      position = lastCard ? lastCard.position + 1 : 0;
    }

    return await (this.prisma as any).card.create({
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type,
        config: JSON.stringify(dto.config),
        position,
        userId: dto.userId,
      },
    });
  }

  async updateCard(id: string, dto: UpdateCardDto) {
    await this.getCardById(id); // 检查卡片是否存在

    const updateData: Record<string, any> = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.config !== undefined)
      updateData.config = JSON.stringify(dto.config);
    if (dto.position !== undefined) updateData.position = dto.position;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    return await (this.prisma as any).card.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteCard(id: string): Promise<void> {
    await this.getCardById(id); // 检查卡片是否存在
    await (this.prisma as any).card.delete({
      where: { id },
    });
  }

  async updateCardPositions(cardIds: string[]): Promise<void> {
    // 批量更新卡片位置
    const updates = cardIds.map((id, index) =>
      (this.prisma as any).card.update({
        where: { id },
        data: { position: index },
      }),
    );

    await Promise.all(updates);
  }

  // 卡片模板相关方法
  async getCardTemplates() {
    return await (this.prisma as any).cardTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCardFromTemplate(
    templateId: string,

    customConfig?: any,
  ) {
    const template = await (this.prisma as any).cardTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID "${templateId}" not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const config = customConfig || JSON.parse(template.defaultConfig);

    return await this.createCard({
      title: template.name,
      description: template.description || undefined,
      type: template.type,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      config,
    });
  }

  async getDefaultCardsByType(type: string) {
    const templates = await (this.prisma as any).cardTemplate.findMany({
      where: { type },
      take: 1,
    });

    if (templates.length === 0) {
      // 返回默认配置

      const defaultConfigs: Record<string, any> = {
        TEXT: {
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
            shadow: false,
          },
        },
        IMAGE: {
          image: {
            url: 'https://via.placeholder.com/300x200',
            alt: '示例图片',
            objectFit: 'cover',
          },
        },
        LINK: {
          link: {
            url: 'https://example.com',
            title: '示例链接',
            description: '这是一个示例链接',
          },
        },
        STATS: {
          stats: {
            value: 100,
            label: '统计数据',
            trend: 'up',
            percentage: 10,
          },
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return defaultConfigs[type] || {};
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(templates[0].defaultConfig);
  }
}
