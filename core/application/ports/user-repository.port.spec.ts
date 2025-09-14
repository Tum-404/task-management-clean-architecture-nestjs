import { User } from '@core/domain/entities/user.entity';
import { UserId } from '@core/domain/value-objects/user-id.vo';
import { Email } from '@core/shared/value-objects/email.vo';
import { UserRepositoryPort } from './user-repository.port';

class MockUserRepository implements UserRepositoryPort {
  private users: Map<string, User> = new Map();
  private emailIndex: Map<string, User> = new Map();

  async save(user: User): Promise<User> {
    this.users.set(user.id.value, user);
    this.emailIndex.set(user.email.value, user);
    return await Promise.resolve(user);
  }

  async findByEmail(email: Email): Promise<User | null> {
    return await Promise.resolve(this.emailIndex.get(email.value) || null);
  }

  async update(user: User): Promise<User> {
    if (!this.users.has(user.id.value)) {
      throw new Error('User not found');
    }
    const oldUser = this.users.get(user.id.value)!;
    this.emailIndex.delete(oldUser.email.value);
    this.users.set(user.id.value, user);
    this.emailIndex.set(user.email.value, user);
    return await Promise.resolve(user);
  }

  async delete(id: UserId): Promise<void> {
    const user = this.users.get(id.value);
    if (user) {
      await Promise.resolve(this.users.delete(id.value));
      this.emailIndex.delete(user.email.value);
    }
  }
}

describe('UserRepositoryPort', () => {
  let repository: UserRepositoryPort;
  let user: User;

  beforeEach(() => {
    repository = new MockUserRepository();
    user = User.create({
      email: Email.create('test@example.com'),
      password: 'password123',
      username: 'testuser',
    });
  });

  describe('save', () => {
    it('should save a user and return it', async () => {
      const savedUser = await repository.save(user);
      expect(savedUser).toBe(user);
      expect(await repository.findByEmail(user.email)).toBe(user);
    });
  });

  describe('findByEmail', () => {
    it('should return null if user not found', async () => {
      const email = Email.create('nonexistent@example.com');
      const result = await repository.findByEmail(email);
      expect(result).toBeNull();
    });

    it('should return user if found', async () => {
      await repository.save(user);
      const result = await repository.findByEmail(user.email);
      expect(result).toBe(user);
    });
  });

  describe('update', () => {
    it('should update existing user', async () => {
      await repository.save(user);
      const updatedUser = User.fromPersistence({
        id: user.id,
        email: Email.create('updated@example.com'),
        password: 'newpassword',
        username: 'updateduser',
      });

      const result = await repository.update(updatedUser);
      expect(result).toBe(updatedUser);
      expect(await repository.findByEmail(updatedUser.email)).toBe(updatedUser);
      expect(await repository.findByEmail(user.email)).toBeNull();
    });

    it('should throw error when updating non-existent user', async () => {
      await expect(repository.update(user)).rejects.toThrow('User not found');
    });
  });

  describe('delete', () => {
    it('should delete existing user', async () => {
      await repository.save(user);
      await repository.delete(user.id);
      expect(await repository.findByEmail(user.email)).toBeNull();
    });

    it('should not throw error when deleting non-existent user', async () => {
      await expect(repository.delete(user.id)).resolves.not.toThrow();
    });
  });
});
