import { IsString, IsOptional, IsObject, IsNumber } from 'class-validator';

export class CreateCardDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  type: string; // 使用string类型，在运行时会检查

  @IsObject()
  config: any; // JSON配置，这里用any因为配置结构会根据类型变化

  @IsOptional()
  @IsNumber()
  position?: number;

  @IsOptional()
  @IsNumber()
  userId?: number;
}
