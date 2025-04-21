import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
    
    @Get('')
    getTasks(): Task[] {
        return this.tasksService.getAllTasks();
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
}
