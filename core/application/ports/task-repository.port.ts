import { Task } from '@core/domain/entities/task.entity';
import { TaskId } from '@core/domain/value-objects/task-id.vo';
import { UserId } from '@core/domain/value-objects/user-id.vo';

export interface TaskRepositoryPort {
  save(Task: Task): Promise<Task>;
  findById(id: TaskId): Promise<Task | null>;
  findByUserId(userId: UserId): Promise<Task[]>;
  findAll(): Promise<Task[]>;
  update(Task: Task): Promise<Task>;
  delete(id: TaskId): Promise<void>;
  isOwner(taskId: TaskId, userId: UserId): Promise<boolean>;
}
