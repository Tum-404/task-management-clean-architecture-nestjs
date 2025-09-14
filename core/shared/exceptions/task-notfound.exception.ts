import { TaskId } from '@core/domain/value-objects/task-id.vo';
import { DomainException } from './domain.exception';

export class TaskNotFoundException extends DomainException {
  constructor(id: TaskId) {
    super(`Task with ID ${id.toString()} not found`);
  }
}
