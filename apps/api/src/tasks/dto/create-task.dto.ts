import { IsNotEmpty } from 'class-validator';
export class CreateTaskDto {
  @IsNotEmpty() title: string;
  desc: string;
}
