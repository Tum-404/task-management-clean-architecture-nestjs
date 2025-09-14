import { UseCase } from '@core/shared/interfaces/use-case.interface';
import { UpdateTaskDto } from '@core/application/dtos/update-task.dto';
import { Task } from '@core/domain/entities/task.entity';
import { TaskRepositoryPort } from '@core/application/ports/task-repository.port';
import { TaskId } from '@core/domain/value-objects/task-id.vo';
import { TaskNotFoundException } from '@core/shared/exceptions/task-notfound.exception';

export class UpdateTaskUseCase implements UseCase<UpdateTaskDto, Task> {
  constructor(private readonly TaskRepository: TaskRepositoryPort) {}

  async execute(dto: UpdateTaskDto): Promise<Task> {
    const taskId = new TaskId(dto.id);
    const existingTask = await this.TaskRepository.findById(taskId);

    if (!existingTask) {
      throw new TaskNotFoundException(taskId);
    }

    if (dto.title !== undefined) {
      existingTask.updateTitle(dto.title);
    }

    if (dto.description !== undefined) {
      existingTask.updateDescription(dto.description);
    }

    if (dto.completed !== undefined) {
      if (dto.completed) {
        existingTask.markAsCompleted();
      } else {
        existingTask.markAsIncomplete();
      }
    }

    return this.TaskRepository.update(existingTask);
  }
}
