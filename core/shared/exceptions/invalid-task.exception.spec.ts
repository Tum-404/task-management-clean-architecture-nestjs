import { InvalidTaskDataException } from './invalid-task.exception';
import { DomainException } from './domain.exception';

describe('InvalidTaskDataException', () => {
  it('should extend DomainException', () => {
    const exception = new InvalidTaskDataException('test message');
    expect(exception).toBeInstanceOf(DomainException);
  });

  it('should format the error message correctly', () => {
    const message = 'title is required';
    const exception = new InvalidTaskDataException(message);
    expect(exception.message).toBe(`Invalid task data: ${message}`);
  });

  it('should set the correct name', () => {
    const exception = new InvalidTaskDataException('test');
    expect(exception.name).toBe('InvalidTaskDataException');
  });

  it('should be catchable as InvalidTaskDataException', () => {
    expect(() => {
      throw new InvalidTaskDataException('test error');
    }).toThrow(InvalidTaskDataException);
  });

  it('should preserve stack trace', () => {
    const exception = new InvalidTaskDataException('test');
    expect(exception.stack).toBeDefined();
    expect(exception.stack).toContain('InvalidTaskDataException');
  });
});
