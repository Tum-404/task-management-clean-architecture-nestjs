import { TaskId } from '@core/domain/value-objects/task-id.vo';
import { Task } from '@core/domain/entities/task.entity';
import { TaskRepositoryPort } from '../ports/task-repository.port';
import { DeleteTaskUseCase } from './delete-task.use-case';
import { TaskNotFoundException } from '@core/shared/exceptions/task-notfound.exception';

describe('DeleteTaskUseCase', () => {
  let useCase: DeleteTaskUseCase;
  let mockTaskRepository: jest.Mocked<TaskRepositoryPort>;

  beforeEach(() => {
    mockTaskRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new DeleteTaskUseCase(mockTaskRepository);
  });

  describe('execute', () => {
    it('should delete an existing task', async () => {
      const task = Task.create({
        title: 'Test Task',
        completed: false,
      });

      mockTaskRepository.findById.mockResolvedValueOnce(task);
      mockTaskRepository.delete.mockResolvedValueOnce();

      await useCase.execute(task.id.value);

      const findTaskByIdArg = mockTaskRepository.findById.mock.calls[0][0];

      expect(findTaskByIdArg).toHaveBeenCalledWith(
        expect.objectContaining({ value: task.id.value }),
      );

      const deleteTask = mockTaskRepository.delete.mock.calls[0][0];
      
      expect(deleteTask).toHaveBeenCalledWith(
        expect.objectContaining({ value: task.id.value }),
      );
    });

    it('should throw TaskNotFoundException when task does not exist', async () => {
      const nonExistentId = new TaskId();
      mockTaskRepository.findById.mockResolvedValueOnce(null);

      await expect(useCase.execute(nonExistentId.value)).rejects.toThrow(
        TaskNotFoundException,
      );
      expect(mockTaskRepository.delete).not.toHaveBeenCalled();
    });

    it('should verify task existence before deletion', async () => {
      const taskId = new TaskId();
      mockTaskRepository.findById.mockResolvedValueOnce(null);

      try {
        await useCase.execute(taskId.value);
      } catch (error) {
        expect(mockTaskRepository.findById).toHaveBeenCalled();
        expect(mockTaskRepository.findById).toHaveBeenCalledWith(
          expect.objectContaining({ value: taskId.value }),
        );
        expect(mockTaskRepository.delete).not.toHaveBeenCalled();
      }
    });

    it('should validate task ID format', async () => {
      const invalidId = 'invalid-uuid-format';

      await expect(useCase.execute(invalidId)).rejects.toThrow();
      expect(mockTaskRepository.delete).not.toHaveBeenCalled();
    });

    it('should not expose internal task ID implementation in error messages', async () => {
      const taskId = new TaskId();
      mockTaskRepository.findById.mockResolvedValueOnce(null);

      try {
        await useCase.execute(taskId.value);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(TaskNotFoundException);
        expect(error.message).toContain(taskId.value);
        // The error should only contain the ID value, not the internal TaskId implementation details
        expect(error.message).not.toContain('TaskId');
      }
    });
  });
});
