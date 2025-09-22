import { UserId } from '@core/domain/value-objects/user-id.vo';

export interface CreateTaskDto {
  title: string;
  description?: string;
  userId: UserId;
}
