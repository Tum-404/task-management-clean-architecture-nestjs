import { Task } from '@core/domain/entities/task.entity';
import { UseCase } from '../../shared/interfaces/use-case.interface';
import { TaskRepositoryPort } from '../ports/task-repository.port';
import { TaskId } from '@core/domain/value-objects/task-id.vo';
import { UserId } from '@core/domain/value-objects/user-id.vo';
import { TaskNotFoundException } from '@core/shared/exceptions/task-notfound.exception';
import { AccessDeniedException } from '@core/shared/exceptions/accessdenied.exception';

export interface GetTaskByIdUseCaseInput {
  id: string;
  userId: UserId;
}

export class GetTaskByIdUseCase
  implements UseCase<GetTaskByIdUseCaseInput, Task>
{
  constructor(private readonly TaskRepository: TaskRepositoryPort) {}

  async execute(input: GetTaskByIdUseCaseInput): Promise<Task> {
    const taskId = new TaskId(input.id);
    const task = await this.TaskRepository.findById(taskId);

    if (!task) {
      throw new TaskNotFoundException(taskId);
    }

    const isOwner = await this.TaskRepository.isOwner(taskId, input.userId);
    if (!isOwner) {
      throw new AccessDeniedException();
    }

    return task;
  }
}
