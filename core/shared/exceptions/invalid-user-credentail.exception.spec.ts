import { InvalidUserCredentialException } from './invalid-user-credentail.exception';
import { DomainException } from './domain.exception';

describe('InvalidUserCredentialException', () => {
  it('should extend DomainException', () => {
    const exception = new InvalidUserCredentialException('test message');
    expect(exception).toBeInstanceOf(DomainException);
  });

  it('should format the error message correctly', () => {
    const message = 'incorrect password';
    const exception = new InvalidUserCredentialException(message);
    expect(exception.message).toBe(`Invalid user credential: ${message}`);
  });

  it('should set the correct name', () => {
    const exception = new InvalidUserCredentialException('test');
    expect(exception.name).toBe('InvalidUserCredentialException');
  });

  it('should be catchable as InvalidUserCredentialException', () => {
    expect(() => {
      throw new InvalidUserCredentialException('test error');
    }).toThrow(InvalidUserCredentialException);
  });

  it('should preserve stack trace', () => {
    const exception = new InvalidUserCredentialException('test');
    expect(exception.stack).toBeDefined();
    expect(exception.stack).toContain('InvalidUserCredentialException');
  });
});
