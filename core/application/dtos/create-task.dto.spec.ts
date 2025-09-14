import { CreateTaskDto } from './create-task.dto';

describe('CreateTaskDto', () => {
  it('should allow creating with required fields', () => {
    const dto: CreateTaskDto = {
      title: 'Test Task',
    };

    expect(dto.title).toBe('Test Task');
    expect(dto.description).toBeUndefined();
  });

  it('should allow creating with optional description', () => {
    const dto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
    };

    expect(dto.title).toBe('Test Task');
    expect(dto.description).toBe('Test Description');
  });
});
