import { SignInUserDto } from './signin-user.dto';

describe('SignInUserDto', () => {
  it('should allow creating with required fields', () => {
    const dto: SignInUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    expect(dto.email).toBe('test@example.com');
    expect(dto.password).toBe('password123');
  });
});
