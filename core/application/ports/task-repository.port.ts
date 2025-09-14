import { Task } from '@core/domain/entities/task.entity';
import { TaskId } from '@core/domain/value-objects/task-id.vo';

export interface TaskRepositoryPort {
  save(Task: Task): Promise<Task>;
  findById(id: TaskId): Promise<Task | null>;
  findAll(): Promise<Task[]>;
  update(Task: Task): Promise<Task>;
  delete(id: TaskId): Promise<void>;
}
