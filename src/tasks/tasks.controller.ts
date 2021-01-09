import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.model';
import { TasksService } from './tasks.service';
import { Response } from 'express';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe.';

type GetTasksResponse = {
  message?: string;
  data: Task[];
};

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
  ): GetTasksResponse {
    return {
      data: this.tasksService.getTasks(filterDto),
    };
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    const task: Task = this.tasksService.getTaskById(id);
    return task;
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Res({ passthrough: true }) res: Response,
    @Body() createTaskDto: CreateTaskDto,
  ): Task {
    const task: Task = this.tasksService.createTask(createTaskDto);
    res.status(HttpStatus.OK);
    return task;
  }

  @Delete('/:id')
  deleteTaskById(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ) {
    this.tasksService.deleteTaskById(id);
    return {
      messsage: 'Deleted.',
    };
  }

  @Patch('/:id/status')
  @UsePipes()
  updateTaskStatusById(
    @Param('id') id: string,
    @Body(TaskStatusValidationPipe) updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTaskById(id, {
      status: updateTaskDto.status,
    });
  }
}
