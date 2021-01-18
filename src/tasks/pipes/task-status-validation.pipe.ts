import { PipeTransform, UnprocessableEntityException } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
  ];

  transform(value: any) {
    const { status } = value;

    if (!status) {
      throw new UnprocessableEntityException(`status field is required.`);
    }

    if (!this.isStatusValid(status)) {
      throw new UnprocessableEntityException(`${status} is an invalid status.`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    return this.allowedStatuses.includes(status);
  }
}
