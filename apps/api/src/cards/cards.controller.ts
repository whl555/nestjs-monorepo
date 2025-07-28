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
import { Card, CardType } from '@prisma/client';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  async getCards(@Query() filterDto?: GetCardsFilterDto): Promise<Card[]> {
    if (filterDto && Object.keys(filterDto).length) {
      return await this.cardsService.getCardsWithFilters(filterDto);
    } else {
      return await this.cardsService.getAllCards();
    }
  }

  @Get('templates')
  async getCardTemplates() {
    return await this.cardsService.getCardTemplates();
  }

  @Get('default/:type')
  async getDefaultCardConfig(@Param('type') type: CardType) {
    return await this.cardsService.getDefaultCardsByType(type);
  }

  @Post()
  async createCard(@Body() dto: CreateCardDto): Promise<Card> {
    return await this.cardsService.createCard(dto);
  }

  @Post('from-template/:templateId')
  async createCardFromTemplate(
    @Param('templateId') templateId: string,
    @Body() customConfig?: any,
  ): Promise<Card> {
    return await this.cardsService.createCardFromTemplate(
      templateId,
      customConfig,
    );
  }

  @Get('/:id')
  async getCardById(@Param('id') id: string): Promise<Card> {
    return await this.cardsService.getCardById(id);
  }

  @Patch('/:id')
  async updateCard(
    @Param('id') id: string,
    @Body() dto: UpdateCardDto,
  ): Promise<Card> {
    return await this.cardsService.updateCard(id, dto);
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