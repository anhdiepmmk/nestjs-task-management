import { Body, Controller, Get, Post } from '@nestjs/common';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

type GetAllTasksResponse = {
  message?: string;
  data: Task[];
};

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(): GetAllTasksResponse {
    return {
      data: this.tasksService.getAllTasks(),
    };
  }

  @Post()
  createTask(
    @Body('title') title: string,
    @Body('description') description: string,
  ): Task {
    const task: Task = this.tasksService.createTask(title, description);
    return task;
  }
}
