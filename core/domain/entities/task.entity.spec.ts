import { Task, TaskProps } from './task.entity';
import { TaskId } from '@core/domain/value-objects/task-id.vo';
import { UserId } from '@core/domain/value-objects/user-id.vo';

describe('Task Entity', () => {
  let mockUserId: UserId;

  beforeEach(() => {
    mockUserId = new UserId('123e4567-e89b-12d3-a456-426614174000');
  });

  describe('create', () => {
    it('should create a new task with generated id and timestamps', () => {
      const props = {
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        userId: mockUserId,
      };

      const task = Task.create(props);

      expect(task.id).toBeDefined();
      expect(task.id).toBeInstanceOf(TaskId);
      expect(task.title).toBe(props.title);
      expect(task.description).toBe(props.description);
      expect(task.completed).toBe(props.completed);
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a task without description', () => {
      const props = {
        title: 'Test Task',
        completed: false,
        userId: mockUserId,
      };

      const task = Task.create(props);

      expect(task.title).toBe(props.title);
      expect(task.description).toBeUndefined();
      expect(task.completed).toBe(props.completed);
    });
  });

  describe('fromPersistence', () => {
    it('should create a task from persistence props', () => {
      const props: TaskProps = {
        id: new TaskId('123e4567-e89b-12d3-a456-426614174000'),
        title: 'Test Task',
        description: 'Test Description',
        completed: true,
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const task = Task.fromPersistence(props);

      expect(task.id).toBe(props.id);
      expect(task.title).toBe(props.title);
      expect(task.description).toBe(props.description);
      expect(task.completed).toBe(props.completed);
      expect(task.createdAt).toBe(props.createdAt);
      expect(task.updatedAt).toBe(props.updatedAt);
    });

    it('should generate missing id and timestamps in persistence data', () => {
      const props: TaskProps = {
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        userId: mockUserId,
      };

      const task = Task.fromPersistence(props);

      expect(task.id).toBeDefined();
      expect(task.id).toBeInstanceOf(TaskId);
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle partial persistence data with only required fields', () => {
      const props: TaskProps = {
        title: 'Test Task',
        userId: mockUserId,
        completed: true,
      };

      const task = Task.fromPersistence(props);

      expect(task.id).toBeDefined();
      expect(task.title).toBe(props.title);
      expect(task.completed).toBe(props.completed);
      expect(task.description).toBeUndefined();
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
    });

    it('should preserve createdAt when updating updatedAt from persistence', () => {
      const createdAt = new Date(2023, 0, 1);
      const updatedAt = new Date(2023, 0, 2);

      const props: TaskProps = {
        title: 'Test Task',
        completed: false,
        userId: mockUserId,
        createdAt,
        updatedAt,
      };

      const task = Task.fromPersistence(props);

      expect(task.createdAt).toEqual(createdAt);
      expect(task.updatedAt).toEqual(updatedAt);
    });
  });

  describe('getters', () => {
    let task: Task;
    let props: TaskProps;

    beforeEach(() => {
      props = {
        title: 'Test Task',
        description: 'Test Description',
        userId: mockUserId,
        completed: false,
      };
      task = Task.create(props);
    });

    it('should return id', () => {
      expect(task.id).toBeDefined();
      expect(task.id).toBeInstanceOf(TaskId);
    });

    it('should return title', () => {
      expect(task.title).toBe(props.title);
    });

    it('should return description', () => {
      expect(task.description).toBe(props.description);
    });

    it('should return completed status', () => {
      expect(task.completed).toBe(props.completed);
    });

    it('should return createdAt', () => {
      expect(task.createdAt).toBeInstanceOf(Date);
    });

    it('should return updatedAt', () => {
      expect(task.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('optional fields', () => {
    it('should handle missing description', () => {
      const task = Task.create({
        title: 'Test Task',
        completed: false,
        userId: mockUserId,
      });

      expect(task.description).toBeUndefined();
    });

    it('should handle empty description', () => {
      const task = Task.create({
        title: 'Test Task',
        description: '',
        completed: false,
        userId: mockUserId,
      });

      expect(task.description).toBe('');
    });
  });
});
