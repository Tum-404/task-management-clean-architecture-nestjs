import { UpdateTaskDto } from './update-task.dto';

describe('UpdateTaskDto', () => {
  it('should allow updating with id only', () => {
    const dto: UpdateTaskDto = {
      id: 'test-id',
    };

    expect(dto.id).toBe('test-id');
    expect(dto.title).toBeUndefined();
    expect(dto.description).toBeUndefined();
    expect(dto.completed).toBeUndefined();
  });

  it('should allow updating with all fields', () => {
    const dto: UpdateTaskDto = {
      id: 'test-id',
      title: 'Updated Title',
      description: 'Updated Description',
      completed: true,
    };

    expect(dto.id).toBe('test-id');
    expect(dto.title).toBe('Updated Title');
    expect(dto.description).toBe('Updated Description');
    expect(dto.completed).toBe(true);
  });

  it('should allow updating with partial fields', () => {
    const dto: UpdateTaskDto = {
      id: 'test-id',
      title: 'Updated Title',
      completed: true,
    };

    expect(dto.id).toBe('test-id');
    expect(dto.title).toBe('Updated Title');
    expect(dto.description).toBeUndefined();
    expect(dto.completed).toBe(true);
  });
});
