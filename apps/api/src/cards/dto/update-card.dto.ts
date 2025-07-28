import {
  IsString,
  IsOptional,
  IsObject,
  IsNumber,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { CardType } from '@prisma/client';

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(CardType)
  type?: CardType;

  @IsOptional()
  @IsObject()
  config?: any;

  @IsOptional()
  @IsNumber()
  position?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
