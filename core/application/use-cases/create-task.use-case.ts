import { Task } from '@core/domain/entities/task.entity';
import { UseCase } from '../../shared/interfaces/use-case.interface';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { TaskRepositoryPort } from '../ports/task-repository.port';

export class CreateTaskUseCase implements UseCase<CreateTaskDto, Task> {
  constructor(private readonly TaskRepository: TaskRepositoryPort) {}

  async execute(dto: CreateTaskDto): Promise<Task> {
    const task = Task.create({
      title: dto.title,
      description: dto.description,
      completed: false,
    });

    return this.TaskRepository.save(task);
  }
}
