import { TaskId } from './task-id.vo';
import { Uuid } from '@core/shared/value-objects/uuid.vo';
import { v4 as uuidv4 } from 'uuid';

describe('TaskId', () => {
  describe('constructor', () => {
    it('should create a new TaskId with auto-generated UUID when no value provided', () => {
      const taskId = new TaskId();
      expect(taskId.value).toBeDefined();
      expect(taskId.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should create a TaskId with provided UUID value', () => {
      const uuid = uuidv4();
      const taskId = new TaskId(uuid);
      expect(taskId.value).toBe(uuid);
    });

    it('should throw error when provided value is empty', () => {
      expect(() => new TaskId('')).toThrow('Task ID cannot be empty');
    });

    it('should extend Uuid class', () => {
      const taskId = new TaskId();
      expect(taskId).toBeInstanceOf(Uuid);
    });
  });

  describe('value object behavior', () => {
    it('should treat two TaskIds with same value as equal', () => {
      const uuid = uuidv4();
      const taskId1 = new TaskId(uuid);
      const taskId2 = new TaskId(uuid);
      expect(taskId1.equals(taskId2)).toBe(true);
    });

    it('should treat two TaskIds with different values as not equal', () => {
      const taskId1 = new TaskId();
      const taskId2 = new TaskId();
      expect(taskId1.equals(taskId2)).toBe(false);
    });

    it('should provide string representation', () => {
      const uuid = uuidv4();
      const taskId = new TaskId(uuid);
      expect(taskId.toString()).toBe(uuid);
    });
  });
});
