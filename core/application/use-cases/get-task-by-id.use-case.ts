import { Task } from '@core/domain/entities/task.entity';
import { UseCase } from '../../shared/interfaces/use-case.interface';
import { TaskRepositoryPort } from '../ports/task-repository.port';
import { TaskId } from '@core/domain/value-objects/task-id.vo';
import { TaskNotFoundException } from '@core/shared/exceptions/task-notfound.exception';

export class GetTaskByIdUseCase implements UseCase<string, Task> {
  constructor(private readonly TaskRepository: TaskRepositoryPort) {}

  async execute(id: string): Promise<Task> {
    const taskId = new TaskId(id);
    const task = await this.TaskRepository.findById(taskId);

    if (!task) {
      throw new TaskNotFoundException(taskId);
    }

    return task;
  }
}
