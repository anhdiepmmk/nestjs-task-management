import { TaskStatus } from '../task-status.enum';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class GetTasksFilterDto {
  @IsOptional()
  @IsIn([TaskStatus.DONE, TaskStatus.OPEN, TaskStatus.IN_PROGRESS])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
