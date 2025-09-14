import { Task } from '@core/domain/entities/task.entity';
import { UseCase } from '@core/shared/interfaces/use-case.interface';
import { TaskRepositoryPort } from '@core/application/ports/task-repository.port';

export class GetTasksUseCase implements UseCase<void, Task[]> {
  constructor(private readonly TaskRepository: TaskRepositoryPort) {}

  async execute(): Promise<Task[]> {
    return this.TaskRepository.findAll();
  }
}
