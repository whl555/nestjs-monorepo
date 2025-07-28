import { IsOptional, IsEnum, IsNumber, IsBoolean, IsString } from 'class-validator';
import { CardType } from '@prisma/client';

export class GetCardsFilterDto {
  @IsOptional()
  @IsEnum(CardType)
  type?: CardType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
} 