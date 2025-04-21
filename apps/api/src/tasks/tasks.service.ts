import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v7 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    createTask(dto: CreateTaskDto): Task {
        const { title, desc } = dto
        const newTask: Task = {
            id: uuid(),
            title: title,
            description: desc,
            status: TaskStatus.OPEN
        };
        this.tasks.push(newTask);
        return newTask;
    }

    getTaskById(id: string): Task | undefined {
        return this.tasks.find((task) => task.id === id )
    }

    deleteTask(id: string) {
        this.tasks = this.tasks.filter((task) => task.id !== id)
    }

    updateTaskStatus(id: string, status: TaskStatus) {
        
    }
}
