import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaApi } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task, TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prismaApi: PrismaApi) {}

  async getAllTasks(): Promise<Task[]> {
    return this.prismaApi.task.findMany();
  }

  async getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const where: any = {};

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

  async createTask(dto: CreateTaskDto): Promise<Task> {
    const { title, desc } = dto;
    
    return this.prismaApi.task.create({
      data: {
        title: title,
        description: desc,
        status: TaskStatus.OPEN,
      }
    });
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.prismaApi.task.findUnique({ where: { id } });
    
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    await this.prismaApi.task.delete({ where: { id } });
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.prismaApi.task.update({
      where: { id },
      data: { status: status }, 
    });
  }
}
