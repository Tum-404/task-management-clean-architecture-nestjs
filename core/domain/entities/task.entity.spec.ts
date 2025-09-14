import { Task, TaskProps } from './task.entity';
import { TaskId } from '@core/domain/value-objects/task-id.vo';

describe('Task Entity', () => {
  describe('create', () => {
    it('should create a new task with generated id and timestamps', () => {
      const props = {
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
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
      };

      const task = Task.create(props);

      expect(task.title).toBe(props.title);
      expect(task.description).toBeUndefined();
      expect(task.completed).toBe(props.completed);
    });
  });

  describe('fromPersistence', () => {
    it('should create a task from persistence data', () => {
      const now = new Date();
      const id = new TaskId();
      const props: TaskProps = {
        id,
        title: 'Test Task',
        description: 'Test Description',
        completed: true,
        createdAt: now,
        updatedAt: now,
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
      };

      const task = Task.fromPersistence(props);

      expect(task.id).toBeDefined();
      expect(task.id).toBeInstanceOf(TaskId);
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('getters', () => {
    let task: Task;
    let props: TaskProps;

    beforeEach(() => {
      props = {
        title: 'Test Task',
        description: 'Test Description',
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
      });

      expect(task.description).toBeUndefined();
    });

    it('should handle empty description', () => {
      const task = Task.create({
        title: 'Test Task',
        description: '',
        completed: false,
      });

      expect(task.description).toBe('');
    });
  });
});
