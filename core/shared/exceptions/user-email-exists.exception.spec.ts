import { UserEmailAlreadyExistsException } from './user-email-exists.exception';
import { DomainException } from './domain.exception';
import { UserEmail } from '@core/domain/value-objects/user-email.vo';

describe('UserEmailAlreadyExistsException', () => {
  let userEmail: UserEmail;

  beforeEach(() => {
    userEmail = UserEmail.create('test@example.com') as UserEmail;
  });

  it('should extend DomainException', () => {
    const exception = new UserEmailAlreadyExistsException(userEmail);
    expect(exception).toBeInstanceOf(DomainException);
  });

  it('should format the error message correctly with UserEmail', () => {
    const exception = new UserEmailAlreadyExistsException(userEmail);
    expect(exception.message).toBe(
      `User with email ${userEmail.toString()} already exists`,
    );
  });

  it('should set the correct name', () => {
    const exception = new UserEmailAlreadyExistsException(userEmail);
    expect(exception.name).toBe('UserEmailAlreadyExistsException');
  });

  it('should be catchable as UserEmailAlreadyExistsException', () => {
    expect(() => {
      throw new UserEmailAlreadyExistsException(userEmail);
    }).toThrow(UserEmailAlreadyExistsException);
  });

  it('should preserve stack trace', () => {
    const exception = new UserEmailAlreadyExistsException(userEmail);
    expect(exception.stack).toBeDefined();
    expect(exception.stack).toContain('UserEmailAlreadyExistsException');
  });

  it('should use the string representation of UserEmail in the message', () => {
    const exception = new UserEmailAlreadyExistsException(userEmail);
    expect(exception.message).toContain(userEmail.toString());
  });

  it('should handle different email addresses correctly', () => {
    const emails = [
      'another@example.com',
      'user@domain.com',
      'test.user@company.co.uk',
    ];

    emails.forEach((email) => {
      const userEmail = UserEmail.create(email) as UserEmail;
      const exception = new UserEmailAlreadyExistsException(userEmail);
      expect(exception.message).toBe(`User with email ${email} already exists`);
    });
  });
});
