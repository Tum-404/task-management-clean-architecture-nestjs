import { UseCase } from '../../shared/interfaces/use-case.interface';
import { TaskRepositoryPort } from '../ports/task-repository.port';
import { TaskNotFoundException } from '@core/shared/exceptions/task-notfound.exception';
import { TaskId } from '@core/domain/value-objects/task-id.vo';
import { UserId } from '@core/domain/value-objects/user-id.vo';
import { AccessDeniedException } from '@core/shared/exceptions/accessdenied.exception';

export interface DeleteTaskUseCaseInput {
  id: string;
  userId: UserId;
}

export class DeleteTaskUseCase
  implements UseCase<DeleteTaskUseCaseInput, void>
{
  constructor(private readonly TaskRepository: TaskRepositoryPort) {}

  async execute(input: DeleteTaskUseCaseInput): Promise<void> {
    const taskId = new TaskId(input.id);
    const existingTask = await this.TaskRepository.findById(taskId);

    if (!existingTask) {
      throw new TaskNotFoundException(taskId);
    }

    const isOwner = await this.TaskRepository.isOwner(taskId, input.userId);
    if (!isOwner) {
      throw new AccessDeniedException();
    }

    await this.TaskRepository.delete(taskId);
  }
}
