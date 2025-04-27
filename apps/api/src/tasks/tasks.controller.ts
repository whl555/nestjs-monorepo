import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
    
    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
      if (Object.keys(filterDto).length) {
        return this.tasksService.getTasksWithFilters(filterDto);
      } else {
        return this.tasksService.getAllTasks();
      }
    }
    @Post()
    createTask(@Body() dto: CreateTaskDto): Task {
        return this.tasksService.createTask(dto)
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task | undefined {
        return this.tasksService.getTaskById(id)
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string) {
        return this.tasksService.deleteTask(id)
    }

    @Patch('/:id/status')
    updateTaskStatus(
      @Param('id') id: string,
      @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    ): Task {
      const { status } = updateTaskStatusDto;
      return this.tasksService.updateTaskStatus(id, status);
    }
}
