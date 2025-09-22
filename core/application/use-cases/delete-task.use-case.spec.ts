import { TaskId } from '@core/domain/value-objects/task-id.vo';
import { UserId } from '@core/domain/value-objects/user-id.vo';
import { Task } from '@core/domain/entities/task.entity';
import { TaskRepositoryPort } from '../ports/task-repository.port';
import { DeleteTaskUseCase } from './delete-task.use-case';
import { TaskNotFoundException } from '@core/shared/exceptions/task-notfound.exception';
import { AccessDeniedException } from '@core/shared/exceptions/accessdenied.exception';

describe('DeleteTaskUseCase', () => {
  let useCase: DeleteTaskUseCase;
  let mockTaskRepository: jest.Mocked<TaskRepositoryPort>;
  let mockUserId: UserId;

  beforeEach(() => {
    mockTaskRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
      isOwner: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockUserId = new UserId('123e4567-e89b-12d3-a456-426614174000');
    useCase = new DeleteTaskUseCase(mockTaskRepository);
  });

  describe('execute', () => {
    it('should delete an existing task when user is the owner', async () => {
      const task = Task.create({
        title: 'Test Task',
        completed: false,
        userId: mockUserId,
      });

      const { findById, isOwner, delete: deleteTask } = mockTaskRepository;

      findById.mockResolvedValueOnce(task);
      isOwner.mockResolvedValueOnce(true);
      deleteTask.mockResolvedValueOnce();

      await useCase.execute({ id: task.id.value, userId: mockUserId });

      expect(findById).toHaveBeenCalledWith(task.id);
      expect(isOwner).toHaveBeenCalledWith(task.id, mockUserId);
      expect(deleteTask).toHaveBeenCalledWith(task.id);
    });

    it('should throw TaskNotFoundException when task does not exist', async () => {
      const nonExistentId = new TaskId();
      const { findById, delete: deleteTask } = mockTaskRepository;

      findById.mockResolvedValueOnce(null);

      await expect(
        useCase.execute({ id: nonExistentId.value, userId: mockUserId }),
      ).rejects.toThrow(TaskNotFoundException);
      expect(deleteTask).not.toHaveBeenCalled();
    });

    it('should verify task existence before deletion', async () => {
      const taskId = new TaskId();
      mockTaskRepository.findById.mockResolvedValueOnce(null);

      await expect(
        useCase.execute({ id: taskId.value, userId: mockUserId }),
      ).rejects.toThrow();

      const findById = mockTaskRepository.findById;
      const deleteMethod = mockTaskRepository.delete;

      expect(findById).toHaveBeenCalled();
      expect(findById).toHaveBeenCalledWith(taskId);
      expect(deleteMethod).not.toHaveBeenCalled();
    });

    it('should validate task ID format', async () => {
      const invalidId = 'invalid-uuid-format';

      await expect(
        useCase.execute({ id: invalidId, userId: mockUserId }),
      ).rejects.toThrow();
      expect(mockTaskRepository.delete).not.toHaveBeenCalled();
    });

    it('should not expose internal task ID implementation in error messages', async () => {
      const taskId = new TaskId();
      const { findById } = mockTaskRepository;

      findById.mockResolvedValueOnce(null);

      await expect(
        useCase.execute({ id: taskId.value, userId: mockUserId }),
      ).rejects.toThrow(TaskNotFoundException);

      // Verify the error message doesn't contain implementation details
      await expect(
        useCase.execute({ id: taskId.value, userId: mockUserId }),
      ).rejects.not.toThrow(/TaskId/);
    });

    it('should throw AccessDeniedException when user is not the task owner', async () => {
      const task = Task.create({
        title: 'Test Task',
        completed: false,
        userId: mockUserId,
      });

      const { findById, isOwner, delete: deleteTask } = mockTaskRepository;

      findById.mockResolvedValueOnce(task);
      isOwner.mockResolvedValueOnce(false);

      await expect(
        useCase.execute({ id: task.id.value, userId: mockUserId }),
      ).rejects.toThrow(AccessDeniedException);
      expect(deleteTask).not.toHaveBeenCalled();
    });
  });
});
