import { Task } from '@core/domain/entities/task.entity';
import { UseCase } from '@core/shared/interfaces/use-case.interface';
import { TaskRepositoryPort } from '@core/application/ports/task-repository.port';
import { UserId } from '@core/domain/value-objects/user-id.vo';

export interface GetTasksUseCaseInput {
  userId: UserId;
}

export class GetTasksUseCase implements UseCase<GetTasksUseCaseInput, Task[]> {
  constructor(private readonly TaskRepository: TaskRepositoryPort) {}

  async execute(input: GetTasksUseCaseInput): Promise<Task[]> {
    return this.TaskRepository.findByUserId(input.userId);
  }
}
