import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { Response } from 'express';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

type GetTasksResponse = {
  message?: string;
  data: Task[];
};

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
  ): Promise<GetTasksResponse> {
    const tasks = await this.tasksService.getTasks(filterDto);

    return {
      data: tasks,
    };
  }

  @Get('/:id')
  async getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Res({ passthrough: true }) res: Response,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const promiseTask: Promise<Task> = this.tasksService.createTask(
      createTaskDto,
    );
    res.status(HttpStatus.OK);
    return promiseTask;
  }

  @Delete('/:id')
  deleteTaskById(
    @Res({ passthrough: true }) res: Response,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch('/:id/status')
  @UsePipes()
  updateTaskStatusById(
    @Param('id', ParseIntPipe) id: number,
    @Body(TaskStatusValidationPipe) updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTaskById(id, {
      status: updateTaskDto.status,
    });
  }
}
