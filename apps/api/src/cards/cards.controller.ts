import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { GetCardsFilterDto } from './dto/get-cards-filter.dto';
import { Card, CardType, CardConfig } from '@repo/shared-types';

// Prisma 返回的卡片类型
interface PrismaCard {
  id: string;
  title: string;
  description: string | null;
  type: string;
  config: string;
  position: number;
  isActive: boolean;
  userId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  private convertPrismaCardToCard(prismaCard: PrismaCard): Card {
    return {
      ...prismaCard,
      description: prismaCard.description || undefined,
      userId: prismaCard.userId || undefined,
      type: prismaCard.type as CardType,
      config: JSON.parse(prismaCard.config) as CardConfig,
    };
  }

  @Get()
  async getCards(@Query() filterDto?: GetCardsFilterDto): Promise<Card[]> {
    const prismaCards =
      filterDto && Object.keys(filterDto).length
        ? await this.cardsService.getCardsWithFilters(filterDto)
        : await this.cardsService.getAllCards();

    return prismaCards.map((card) => this.convertPrismaCardToCard(card));
  }

  @Get('templates')
  async getCardTemplates(): Promise<any[]> {
    return await this.cardsService.getCardTemplates();
  }

  @Get('default/:type')
  async getDefaultCardConfig(@Param('type') type: CardType): Promise<any> {
    return await this.cardsService.getDefaultCardsByType(type);
  }

  @Post()
  async createCard(@Body() dto: CreateCardDto): Promise<Card> {
    const prismaCard = await this.cardsService.createCard(dto);
    return this.convertPrismaCardToCard(prismaCard);
  }

  @Post('from-template/:templateId')
  async createCardFromTemplate(
    @Param('templateId') templateId: string,
    @Body() customConfig?: any,
  ): Promise<Card> {
    const prismaCard = await this.cardsService.createCardFromTemplate(
      templateId,
      customConfig,
    );
    return this.convertPrismaCardToCard(prismaCard);
  }

  @Get('/:id')
  async getCardById(@Param('id') id: string): Promise<Card> {
    const prismaCard = await this.cardsService.getCardById(id);
    return this.convertPrismaCardToCard(prismaCard);
  }

  @Patch('/:id')
  async updateCard(
    @Param('id') id: string,
    @Body() dto: UpdateCardDto,
  ): Promise<Card> {
    const prismaCard = await this.cardsService.updateCard(id, dto);
    return this.convertPrismaCardToCard(prismaCard);
  }

  @Delete('/:id')
  async deleteCard(@Param('id') id: string): Promise<void> {
    await this.cardsService.deleteCard(id);
  }

  @Patch('/positions/update')
  async updateCardPositions(@Body() cardIds: string[]): Promise<void> {
    await this.cardsService.updateCardPositions(cardIds);
  }
}
