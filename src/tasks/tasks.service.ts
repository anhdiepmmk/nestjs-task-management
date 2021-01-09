import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasks(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.tasks;

    if (status) {
      tasks = tasks.filter((task: Task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task: Task) => {
        return task.title.includes(search) || task.description.includes(search);
      });
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find((task: Task) => task.id === id);

    if (!found) {
      throw new NotFoundException(`Task id ${id} is not found.`);
    }

    return found;
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

  deleteTaskById(id: string): void {
    const found: Task = this.getTaskById(id);

    const foundIndex: number = this.tasks.findIndex(
      (task: Task) => task.id === found.id,
    );

    this.tasks.splice(foundIndex, 1);
  }

  updateTaskById(id: string, updateTaskDto: UpdateTaskDto): Task {
    const found = this.getTaskById(id);
    Object.assign(found, { ...found, ...updateTaskDto, id: id });
    return found;
  }
}
