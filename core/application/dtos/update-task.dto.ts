import { UserId } from '@core/domain/value-objects/user-id.vo';

export interface UpdateTaskDto {
  id: string;
  userId: UserId;
  title?: string;
  description?: string;
  completed?: boolean;
}
