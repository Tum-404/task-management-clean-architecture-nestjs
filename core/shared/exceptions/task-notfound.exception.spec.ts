import { TaskNotFoundException } from './task-notfound.exception';
import { DomainException } from './domain.exception';
import { TaskId } from '@core/domain/value-objects/task-id.vo';

describe('TaskNotFoundException', () => {
  let taskId: TaskId;

  beforeEach(() => {
    taskId = new TaskId();
  });

  it('should extend DomainException', () => {
    const exception = new TaskNotFoundException(taskId);
    expect(exception).toBeInstanceOf(DomainException);
  });

  it('should format the error message correctly with TaskId', () => {
    const exception = new TaskNotFoundException(taskId);
    expect(exception.message).toBe(
      `Task with ID ${taskId.toString()} not found`,
    );
  });

  it('should set the correct name', () => {
    const exception = new TaskNotFoundException(taskId);
    expect(exception.name).toBe('TaskNotFoundException');
  });

  it('should be catchable as TaskNotFoundException', () => {
    expect(() => {
      throw new TaskNotFoundException(taskId);
    }).toThrow(TaskNotFoundException);
  });

  it('should preserve stack trace', () => {
    const exception = new TaskNotFoundException(taskId);
    expect(exception.stack).toBeDefined();
    expect(exception.stack).toContain('TaskNotFoundException');
  });

  it('should use the string representation of TaskId in the message', () => {
    const exception = new TaskNotFoundException(taskId);
    expect(exception.message).toContain(taskId.toString());
  });
});
