import { User, UserProps } from './user.entity';
import { Email } from '@core/shared/value-objects/email.vo';
import { UserId } from '@core/domain/value-objects/user-id.vo';

describe('User Entity', () => {
  describe('create', () => {
    it('should create a new user with generated id and timestamps', () => {
      const props = {
        username: 'testuser',
        email: Email.create('test@example.com'),
        password: 'password123',
      };

      const user = User.create(props);

      expect(user.id).toBeDefined();
      expect(user.id).toBeInstanceOf(UserId);
      expect(user.username).toBe(props.username);
      expect(user.email).toBe(props.email);
      expect(user.password).toBe(props.password);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should preserve email value object', () => {
      const email = Email.create('test@example.com');
      const user = User.create({
        username: 'testuser',
        email,
        password: 'password123',
      });

      expect(user.email).toBe(email);
      expect(user.email.toString()).toBe('test@example.com');
    });
  });

  describe('fromPersistence', () => {
    it('should create a user from persistence data', () => {
      const now = new Date();
      const id = new UserId();
      const props: UserProps = {
        id,
        username: 'testuser',
        email: Email.create('test@example.com'),
        password: 'password123',
        createdAt: now,
        updatedAt: now,
      };

      const user = User.fromPersistence(props);

      expect(user.id).toBe(props.id);
      expect(user.username).toBe(props.username);
      expect(user.email).toBe(props.email);
      expect(user.password).toBe(props.password);
      expect(user.createdAt).toBe(props.createdAt);
      expect(user.updatedAt).toBe(props.updatedAt);
    });

    it('should generate missing id and timestamps in persistence data', () => {
      const props: UserProps = {
        username: 'testuser',
        email: Email.create('test@example.com'),
        password: 'password123',
      };

      const user = User.fromPersistence(props);

      expect(user.id).toBeDefined();
      expect(user.id).toBeInstanceOf(UserId);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('getters', () => {
    let user: User;
    let props: UserProps;

    beforeEach(() => {
      props = {
        username: 'testuser',
        email: Email.create('test@example.com'),
        password: 'password123',
      };
      user = User.create(props);
    });

    it('should return id', () => {
      expect(user.id).toBeDefined();
      expect(user.id).toBeInstanceOf(UserId);
    });

    it('should return username', () => {
      expect(user.username).toBe(props.username);
    });

    it('should return email', () => {
      expect(user.email).toBe(props.email);
    });

    it('should return password', () => {
      expect(user.password).toBe(props.password);
    });

    it('should return createdAt', () => {
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should return updatedAt', () => {
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });
});
