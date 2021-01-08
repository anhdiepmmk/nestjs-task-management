import { Controller, Get } from '@nestjs/common';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

type GetAllTasksResponse = {
  message?: string;
  data: Task[];
};

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('/')
  getAllTasks(): GetAllTasksResponse {
    return {
      data: this.tasksService.getAllTasks(),
    };
  }
}
