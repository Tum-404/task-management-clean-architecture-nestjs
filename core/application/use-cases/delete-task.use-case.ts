import { UseCase } from '../../shared/interfaces/use-case.interface';
import { TaskRepositoryPort } from '../ports/task-repository.port';
import { TaskNotFoundException } from '@core/shared/exceptions/task-notfound.exception';
import { TaskId } from '@core/domain/value-objects/task-id.vo';

export class DeleteTaskUseCase implements UseCase<string, void> {
  constructor(private readonly TaskRepository: TaskRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const taskId = new TaskId(id);
    const existingTask = await this.TaskRepository.findById(taskId);

    if (!existingTask) {
      throw new TaskNotFoundException(taskId);
    }

    await this.TaskRepository.delete(taskId);
  }
}
