import { IsString, IsEnum, IsOptional, IsObject, IsNumber, IsBoolean } from 'class-validator';
import { CardType } from '@prisma/client';

export class CreateCardDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(CardType)
  type: CardType;

  @IsObject()
  config: any; // JSON配置，这里用any因为配置结构会根据类型变化

  @IsOptional()
  @IsNumber()
  position?: number;

  @IsOptional()
  @IsNumber()
  userId?: number;
} 