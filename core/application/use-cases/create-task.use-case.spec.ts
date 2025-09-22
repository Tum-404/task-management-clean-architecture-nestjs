import { Task } from '@core/domain/entities/task.entity';
import { UserId } from '@core/domain/value-objects/user-id.vo';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { TaskRepositoryPort } from '../ports/task-repository.port';
import { CreateTaskUseCase } from './create-task.use-case';

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
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

    useCase = new CreateTaskUseCase(mockTaskRepository);
  });

  describe('execute', () => {
    it('should create a task with required fields', async () => {
      const dto: CreateTaskDto = {
        title: 'Test Task',
        userId: mockUserId,
      };

      const expectedTask = Task.create({
        title: dto.title,
        completed: false,
        userId: mockUserId,
      });

      mockTaskRepository.save.mockResolvedValueOnce(expectedTask);

      const result = await useCase.execute(dto);

      expect(mockTaskRepository.save.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          title: dto.title,
          completed: false,
        }),
      );
      expect(result).toBe(expectedTask);
    });

    it('should create a task with all fields', async () => {
      const dto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        userId: mockUserId,
      };

      const expectedTask = Task.create({
        title: dto.title,
        description: dto.description,
        completed: false,
        userId: mockUserId,
      });

      mockTaskRepository.save.mockResolvedValueOnce(expectedTask);

      const result = await useCase.execute(dto);

      const savedTaskArg = mockTaskRepository.save.mock.calls[0][0];

      expect(savedTaskArg).toEqual(
        expect.objectContaining({
          title: dto.title,
          description: dto.description,
          completed: false,
        }),
      );
      expect(result).toBe(expectedTask);
    });

    it('should generate unique ids for different tasks', async () => {
      const dto1: CreateTaskDto = {
        title: 'Task 1',
        userId: mockUserId,
      };

      const dto2: CreateTaskDto = {
        title: 'Task 2',
        userId: mockUserId,
      };

      mockTaskRepository.save.mockImplementation((task) =>
        Promise.resolve(task),
      );

      const result1 = await useCase.execute(dto1);
      const result2 = await useCase.execute(dto2);

      expect(result1.id).not.toEqual(result2.id);
    });

    it('should set initial completed status to false', async () => {
      const dto: CreateTaskDto = {
        title: 'Test Task',
        userId: mockUserId,
      };

      mockTaskRepository.save.mockImplementation((task) =>
        Promise.resolve(task),
      );

      const result = await useCase.execute(dto);

      expect(result.completed).toBe(false);
    });
  });
});
