import { Task } from '@core/domain/entities/task.entity';
import { TaskId } from '@core/domain/value-objects/task-id.vo';
import { TaskRepositoryPort } from './task-repository.port';

class MockTaskRepository implements TaskRepositoryPort {
  private tasks: Map<string, Task> = new Map();

  async save(task: Task): Promise<Task> {
    this.tasks.set(task.id.value, task);
    return await Promise.resolve(task);
  }

  async findById(id: TaskId): Promise<Task | null> {
    return await Promise.resolve(this.tasks.get(id.value) || null);
  }

  async findAll(): Promise<Task[]> {
    return await Promise.resolve(Array.from(this.tasks.values()));
  }

  async update(task: Task): Promise<Task> {
    if (!this.tasks.has(task.id.value)) {
      throw new Error('Task not found');
    }
    this.tasks.set(task.id.value, task);
    return await Promise.resolve(task);
  }

  async delete(id: TaskId): Promise<void> {
    await Promise.resolve(this.tasks.delete(id.value));
  }
}

describe('TaskRepositoryPort', () => {
  let repository: TaskRepositoryPort;
  let task: Task;

  beforeEach(() => {
    repository = new MockTaskRepository();
    task = Task.create({
      title: 'Test Task',
      description: 'Test Description',
      completed: false,
    });
  });

  describe('save', () => {
    it('should save a task and return it', async () => {
      const savedTask = await repository.save(task);
      expect(savedTask).toBe(task);
      expect(await repository.findById(task.id)).toBe(task);
    });
  });

  describe('findById', () => {
    it('should return null if task not found', async () => {
      const result = await repository.findById(new TaskId());
      expect(result).toBeNull();
    });

    it('should return task if found', async () => {
      await repository.save(task);
      const result = await repository.findById(task.id);
      expect(result).toBe(task);
    });
  });

  describe('findAll', () => {
    it('should return empty array when no tasks exist', async () => {
      const tasks = await repository.findAll();
      expect(tasks).toEqual([]);
    });

    it('should return all tasks', async () => {
      const task2 = Task.create({
        title: 'Test Task 2',
        description: 'Test Description 2',
        completed: true,
      });

      await repository.save(task);
      await repository.save(task2);

      const tasks = await repository.findAll();
      expect(tasks).toHaveLength(2);
      expect(tasks).toContain(task);
      expect(tasks).toContain(task2);
    });
  });

  describe('update', () => {
    it('should update existing task', async () => {
      await repository.save(task);
      const updatedTask = Task.fromPersistence({
        id: task.id,
        title: 'Updated Task',
        description: 'Updated Description',
        completed: true,
      });

      const result = await repository.update(updatedTask);
      expect(result).toBe(updatedTask);
      expect(await repository.findById(task.id)).toBe(updatedTask);
    });

    it('should throw error when updating non-existent task', async () => {
      await expect(repository.update(task)).rejects.toThrow('Task not found');
    });
  });

  describe('delete', () => {
    it('should delete existing task', async () => {
      await repository.save(task);
      await repository.delete(task.id);
      expect(await repository.findById(task.id)).toBeNull();
    });

    it('should not throw error when deleting non-existent task', async () => {
      await expect(repository.delete(task.id)).resolves.not.toThrow();
    });
  });
});
