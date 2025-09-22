import { Task } from '@core/domain/entities/task.entity';
import { UserId } from '@core/domain/value-objects/user-id.vo';
import { TaskRepositoryPort } from '../ports/task-repository.port';
import { GetTasksUseCase } from './get-tasks.use-case';

describe('GetTasksUseCase', () => {
  let useCase: GetTasksUseCase;
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
    useCase = new GetTasksUseCase(mockTaskRepository);
  });

  describe('execute', () => {
    it('should return empty array when no tasks exist for the user', async () => {
      mockTaskRepository.findByUserId.mockResolvedValueOnce([]);

      const result = await useCase.execute({ userId: mockUserId });

      expect(mockTaskRepository.findByUserId).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual([]);
    });

    it('should return all existing tasks for the user', async () => {
      const tasks = [
        Task.create({
          title: 'Task 1',
          completed: false,
          userId: mockUserId,
        }),
        Task.create({
          title: 'Task 2',
          description: 'Description 2',
          completed: true,
          userId: mockUserId,
        }),
      ];

      mockTaskRepository.findByUserId.mockResolvedValueOnce(tasks);

      const result = await useCase.execute({ userId: mockUserId });

      expect(mockTaskRepository.findByUserId).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(tasks);
      expect(result).toHaveLength(2);
    });

    it('should maintain task order from repository', async () => {
      const tasks = [
        Task.create({
          title: 'Task 1',
          completed: false,
          userId: mockUserId,
        }),
        Task.create({
          title: 'Task 2',
          completed: true,
          userId: mockUserId,
        }),
      ];

      mockTaskRepository.findByUserId.mockResolvedValueOnce(tasks);

      const result = await useCase.execute({ userId: mockUserId });

      expect(result[0].title).toBe('Task 1');
      expect(result[1].title).toBe('Task 2');
    });

    it('should return complete task data', async () => {
      const task = Task.create({
        title: 'Complete Task',
        description: 'Detailed description',
        completed: true,
        userId: mockUserId,
      });

      mockTaskRepository.findByUserId.mockResolvedValueOnce([task]);

      const result = await useCase.execute({ userId: mockUserId });
      const retrievedTask = result[0];

      expect(retrievedTask.title).toBe(task.title);
      expect(retrievedTask.description).toBe(task.description);
      expect(retrievedTask.completed).toBe(task.completed);
      expect(retrievedTask.userId).toEqual(mockUserId);
      expect(retrievedTask.id).toBeDefined();
      expect(retrievedTask.createdAt).toBeDefined();
      expect(retrievedTask.updatedAt).toBeDefined();
    });
  });
});
