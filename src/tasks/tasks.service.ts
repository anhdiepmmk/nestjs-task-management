import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task: Task) => task.id === id);
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  deleteTaskById(id: string): boolean {
    const foundIndex = this.tasks.findIndex((task: Task) => task.id === id);
    if (foundIndex > -1) {
      this.tasks.splice(foundIndex, 1);
      return true;
    }
    return false;
  }

  updateTaskById(id: string, updateTaskDto: UpdateTaskDto): boolean | Task {
    const found: Task | undefined = this.tasks.find(
      (task: Task) => task.id === id,
    );

    if (found) {
      Object.assign(found, { ...found, ...updateTaskDto, id: id });
      return found;
    }
    return false;
  }
}
