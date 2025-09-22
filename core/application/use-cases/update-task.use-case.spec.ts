import { Task } from '@core/domain/entities/task.entity';
import { UserId } from '@core/domain/value-objects/user-id.vo';
import { TaskId } from '@core/domain/value-objects/task-id.vo';
import { TaskRepositoryPort } from '../ports/task-repository.port';
import { UpdateTaskUseCase } from './update-task.use-case';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { TaskNotFoundException } from '@core/shared/exceptions/task-notfound.exception';
import { AccessDeniedException } from '@core/shared/exceptions/accessdenied.exception';

describe('UpdateTaskUseCase', () => {
  let useCase: UpdateTaskUseCase;
  let mockTaskRepository: jest.Mocked<TaskRepositoryPort>;
  let mockUserId: UserId;
  let mockTaskId: TaskId;
  let existingTask: Task;

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

    existingTask = Task.create({
      title: 'Original Title',
      description: 'Original Description',
      completed: false,
      userId: mockUserId,
    });

    useCase = new UpdateTaskUseCase(mockTaskRepository);
  });

  describe('execute', () => {
    it('should successfully update a task title', async () => {
      const dto: UpdateTaskDto = {
        id: mockTaskId.value,
        userId: mockUserId,
        title: 'Updated Title',
      };

      mockTaskRepository.findById.mockResolvedValue(existingTask);
      mockTaskRepository.isOwner.mockResolvedValue(true);
      mockTaskRepository.update.mockImplementation((task) =>
        Promise.resolve(task),
      );

      const result = await useCase.execute(dto);

      expect(result.title).toBe('Updated Title');
      expect(result.description).toBe('Original Description');
      expect(result.completed).toBe(false);
      expect(mockTaskRepository.update).toHaveBeenCalledWith(result);
    });

    it('should successfully update a task description', async () => {
      const dto: UpdateTaskDto = {
        id: mockTaskId.value,
        userId: mockUserId,
        description: 'Updated Description',
      };

      mockTaskRepository.findById.mockResolvedValue(existingTask);
      mockTaskRepository.isOwner.mockResolvedValue(true);
      mockTaskRepository.update.mockImplementation((task) =>
        Promise.resolve(task),
      );

      const result = await useCase.execute(dto);

      expect(result.title).toBe('Original Title');
      expect(result.description).toBe('Updated Description');
      expect(result.completed).toBe(false);
      expect(mockTaskRepository.update).toHaveBeenCalledWith(result);
    });

    it('should successfully mark a task as completed', async () => {
      const dto: UpdateTaskDto = {
        id: mockTaskId.value,
        userId: mockUserId,
        completed: true,
      };

      mockTaskRepository.findById.mockResolvedValue(existingTask);
      mockTaskRepository.isOwner.mockResolvedValue(true);
      mockTaskRepository.update.mockImplementation((task) =>
        Promise.resolve(task),
      );

      const result = await useCase.execute(dto);

      expect(result.title).toBe('Original Title');
      expect(result.description).toBe('Original Description');
      expect(result.completed).toBe(true);
      expect(mockTaskRepository.update).toHaveBeenCalledWith(result);
    });

    it('should throw TaskNotFoundException when task does not exist', async () => {
      const dto: UpdateTaskDto = {
        id: mockTaskId.value,
        userId: mockUserId,
        title: 'Updated Title',
      };

      mockTaskRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(dto)).rejects.toThrow(TaskNotFoundException);
      expect(mockTaskRepository.update).not.toHaveBeenCalled();
    });

    it('should throw AccessDeniedException when user is not the owner', async () => {
      const dto: UpdateTaskDto = {
        id: mockTaskId.value,
        userId: mockUserId,
        title: 'Updated Title',
      };

      mockTaskRepository.findById.mockResolvedValue(existingTask);
      mockTaskRepository.isOwner.mockResolvedValue(false);

      await expect(useCase.execute(dto)).rejects.toThrow(AccessDeniedException);
      expect(mockTaskRepository.update).not.toHaveBeenCalled();
    });

    it('should not modify undefined fields', async () => {
      const dto: UpdateTaskDto = {
        id: mockTaskId.value,
        userId: mockUserId,
      };

      mockTaskRepository.findById.mockResolvedValue(existingTask);
      mockTaskRepository.isOwner.mockResolvedValue(true);
      mockTaskRepository.update.mockImplementation((task) =>
        Promise.resolve(task),
      );

      const result = await useCase.execute(dto);

      expect(result.title).toBe('Original Title');
      expect(result.description).toBe('Original Description');
      expect(result.completed).toBe(false);
      expect(mockTaskRepository.update).toHaveBeenCalledWith(result);
    });
  });
});
