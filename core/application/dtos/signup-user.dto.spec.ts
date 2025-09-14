import { SignUpUserDto } from './signup-user.dto';

describe('SignUpUserDto', () => {
  it('should allow creating with required fields', () => {
    const dto: SignUpUserDto = {
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
    };

    expect(dto.email).toBe('test@example.com');
    expect(dto.password).toBe('password123');
    expect(dto.username).toBe('testuser');
  });
});
