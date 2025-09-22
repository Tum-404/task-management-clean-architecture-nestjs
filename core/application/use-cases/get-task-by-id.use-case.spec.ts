import { Task } from '@core/domain/entities/task.entity';
import { TaskRepositoryPort } from '../ports/task-repository.port';
import {
  GetTaskByIdUseCase,
  GetTaskByIdUseCaseInput,
} from './get-task-by-id.use-case';
import { TaskId } from '@core/domain/value-objects/task-id.vo';
import { UserId } from '@core/domain/value-objects/user-id.vo';
import { TaskNotFoundException } from '@core/shared/exceptions/task-notfound.exception';
import { AccessDeniedException } from '@core/shared/exceptions/accessdenied.exception';

describe('GetTaskByIdUseCase', () => {
  let useCase: GetTaskByIdUseCase;
  let mockTaskRepository: jest.Mocked<TaskRepositoryPort>;
  let mockUserId: UserId;
  let mockTaskId: TaskId;
  let mockTask: Task;

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
    mockTaskId = new TaskId('987fcdeb-51a2-43f7-91d1-234567890123');

    mockTask = Task.create({
      title: 'Test Task',
      description: 'Test Description',
      completed: false,
      userId: mockUserId,
    });

    useCase = new GetTaskByIdUseCase(mockTaskRepository);
  });

  describe('execute', () => {
    it('should successfully return a task when it exists and user is owner', async () => {
      const input: GetTaskByIdUseCaseInput = {
        id: mockTaskId.value,
        userId: mockUserId,
      };

      mockTaskRepository.findById.mockResolvedValue(mockTask);
      mockTaskRepository.isOwner.mockResolvedValue(true);

      const result = await useCase.execute(input);

      expect(result).toBe(mockTask);
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(
        expect.objectContaining({
          value: mockTaskId.value,
        }),
      );
      expect(mockTaskRepository.isOwner).toHaveBeenCalledWith(
        expect.objectContaining({
          value: mockTaskId.value,
        }),
        mockUserId,
      );
    });

    it('should throw TaskNotFoundException when task does not exist', async () => {
      const input: GetTaskByIdUseCaseInput = {
        id: mockTaskId.value,
        userId: mockUserId,
      };

      mockTaskRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(input)).rejects.toThrow(
        TaskNotFoundException,
      );
      expect(mockTaskRepository.isOwner).not.toHaveBeenCalled();
    });

    it('should throw AccessDeniedException when user is not the owner', async () => {
      const input: GetTaskByIdUseCaseInput = {
        id: mockTaskId.value,
        userId: mockUserId,
      };

      mockTaskRepository.findById.mockResolvedValue(mockTask);
      mockTaskRepository.isOwner.mockResolvedValue(false);

      await expect(useCase.execute(input)).rejects.toThrow(
        AccessDeniedException,
      );
    });
  });
});
