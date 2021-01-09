import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.model';
import { TasksService } from './tasks.service';
import { Response } from 'express';
import { UpdateTaskDto } from './dto/update-task.dto';

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

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    const task: Task = this.tasksService.getTaskById(id);

    if (!task) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Task id ${id} is not found.`,
      });
    }

    return task;
  }

  @Post()
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
    const result = this.tasksService.deleteTaskById(id);
    if (result) {
      return {
        messsage: 'Deleted.',
      };
    }

    res.status(404);
    return {
      messsage: `Cannot delete this record, seem like the record with id ${id} is not exist.`,
    };
  }

  @Patch('/:id/status')
  updateTaskStatusById(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const result = this.tasksService.updateTaskById(id, {
      status: updateTaskDto.status,
    });

    if (result) {
      return result;
    }

    throw new NotFoundException({
      message: `Cannot update this record, seem like the record with id ${id} is not exist.`,
    });
  }
}
