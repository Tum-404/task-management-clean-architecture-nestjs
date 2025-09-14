import { Task } from '@core/domain/entities/task.entity';
import { TaskRepositoryPort } from '../ports/task-repository.port';
import { GetTasksUseCase } from './get-tasks.use-case';

describe('GetTasksUseCase', () => {
  let useCase: GetTasksUseCase;
  let mockTaskRepository: jest.Mocked<TaskRepositoryPort>;

  beforeEach(() => {
    mockTaskRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new GetTasksUseCase(mockTaskRepository);
  });

  describe('execute', () => {
    it('should return empty array when no tasks exist', async () => {
      mockTaskRepository.findAll.mockResolvedValueOnce([]);

      const result = await useCase.execute();

      expect(mockTaskRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should return all existing tasks', async () => {
      const tasks = [
        Task.create({
          title: 'Task 1',
          completed: false,
        }),
        Task.create({
          title: 'Task 2',
          description: 'Description 2',
          completed: true,
        }),
      ];

      mockTaskRepository.findAll.mockResolvedValueOnce(tasks);

      const result = await useCase.execute();

      expect(mockTaskRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(tasks);
      expect(result).toHaveLength(2);
    });

    it('should maintain task order from repository', async () => {
      const tasks = [
        Task.create({
          title: 'Task 1',
          completed: false,
        }),
        Task.create({
          title: 'Task 2',
          completed: true,
        }),
      ];

      mockTaskRepository.findAll.mockResolvedValueOnce(tasks);

      const result = await useCase.execute();

      expect(result[0].title).toBe('Task 1');
      expect(result[1].title).toBe('Task 2');
    });

    it('should return complete task data', async () => {
      const task = Task.create({
        title: 'Complete Task',
        description: 'Detailed description',
        completed: true,
      });

      mockTaskRepository.findAll.mockResolvedValueOnce([task]);

      const result = await useCase.execute();
      const retrievedTask = result[0];

      expect(retrievedTask.title).toBe(task.title);
      expect(retrievedTask.description).toBe(task.description);
      expect(retrievedTask.completed).toBe(task.completed);
      expect(retrievedTask.id).toBeDefined();
      expect(retrievedTask.createdAt).toBeDefined();
      expect(retrievedTask.updatedAt).toBeDefined();
    });
  });
});
