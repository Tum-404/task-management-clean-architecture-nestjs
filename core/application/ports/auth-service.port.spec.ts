import { User } from '@core/domain/entities/user.entity';
import { Email } from '@core/shared/value-objects/email.vo';
import { AuthServicePort } from './auth-service.port';

class MockAuthService implements AuthServicePort {
  private secretKey = 'test-secret';

  async generateAccessToken(user: User): Promise<string> {
    // Mock implementation returns a deterministic token for testing
    return await Promise.resolve(`token.${user.id.value}.${user.email.value}`);
  }
}

describe('AuthServicePort', () => {
  let authService: AuthServicePort;
  let user: User;

  beforeEach(() => {
    authService = new MockAuthService();
    user = User.create({
      email: Email.create('test@example.com'),
      password: 'password123',
      username: 'testuser',
    });
  });

  describe('generateAccessToken', () => {
    it('should generate a token for a user', async () => {
      const token = await authService.generateAccessToken(user);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token).toContain(user.id.value);
      expect(token).toContain(user.email.value);
    });

    it('should generate different tokens for different users', async () => {
      const user2 = User.create({
        email: Email.create('test2@example.com'),
        password: 'password123',
        username: 'testuser2',
      });

      const token1 = await authService.generateAccessToken(user);
      const token2 = await authService.generateAccessToken(user2);

      expect(token1).not.toBe(token2);
    });

    it('should generate consistent tokens for the same user', async () => {
      const token1 = await authService.generateAccessToken(user);
      const token2 = await authService.generateAccessToken(user);

      expect(token1).toBe(token2);
    });
  });
});
