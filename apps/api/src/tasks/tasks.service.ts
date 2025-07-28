import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaApi } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prismaApi: PrismaApi) {}

  async getAllTasks() {
    return this.prismaApi.task.findMany();
  }

  async getTasksWithFilters(filterDto: GetTasksFilterDto) {
    const { status, search } = filterDto;

    const where: Record<string, any> = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prismaApi.task.findMany({ where });
  }

  async createTask(dto: CreateTaskDto) {
    const { title, desc } = dto;

    return this.prismaApi.task.create({
      data: {
        title,
        description: desc,

        status: 'OPEN', // 默认状态
      },
    });
  }

  async getTaskById(id: string) {
    const task = await this.prismaApi.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async updateTaskStatus(id: string, status: string) {
    await this.getTaskById(id); // 检查任务是否存在

    return this.prismaApi.task.update({
      where: { id },
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        status: status as any, // 类型断言绕过类型检查
      },
    });
  }

  async deleteTask(id: string): Promise<void> {
    await this.getTaskById(id); // 检查任务是否存在
    await this.prismaApi.task.delete({
      where: { id },
    });
  }
}
