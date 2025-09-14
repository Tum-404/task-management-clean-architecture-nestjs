import { DomainException } from './domain.exception';

// Concrete implementation for testing
class TestDomainException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}

// Another concrete implementation for testing inheritance
class CustomDomainException extends DomainException {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.code = code;
  }
}

describe('DomainException', () => {
  describe('Basic Exception Behavior', () => {
    it('should create an exception with the correct message', () => {
      const message = 'Test error message';
      const exception = new TestDomainException(message);

      expect(exception.message).toBe(message);
    });

    it('should set the correct name based on the class', () => {
      const exception = new TestDomainException('Test message');

      expect(exception.name).toBe('TestDomainException');
    });

    it('should be instance of Error', () => {
      const exception = new TestDomainException('Test message');

      expect(exception).toBeInstanceOf(Error);
    });

    it('should be instance of DomainException', () => {
      const exception = new TestDomainException('Test message');

      expect(exception).toBeInstanceOf(DomainException);
    });
  });

  describe('Stack Trace', () => {
    it('should capture stack trace', () => {
      const exception = new TestDomainException('Test message');

      expect(exception.stack).toBeDefined();
      expect(typeof exception.stack).toBe('string');
    });

    it('should include the error message in stack trace', () => {
      const message = 'Specific error message';
      const exception = new TestDomainException(message);

      expect(exception.stack).toContain(message);
    });
  });

  describe('Extended Functionality', () => {
    it('should allow extending with additional properties', () => {
      const message = 'Custom error';
      const code = 'ERR001';
      const exception = new CustomDomainException(message, code);

      expect(exception.message).toBe(message);
      expect(exception.code).toBe(code);
      expect(exception.name).toBe('CustomDomainException');
    });

    it('should maintain inheritance chain with extended classes', () => {
      const exception = new CustomDomainException('Test', 'CODE');

      expect(exception).toBeInstanceOf(CustomDomainException);
      expect(exception).toBeInstanceOf(DomainException);
      expect(exception).toBeInstanceOf(Error);
    });
  });

  describe('Error Handling', () => {
    it('should be catchable as a standard error', () => {
      expect(() => {
        throw new TestDomainException('Test error');
      }).toThrow(Error);
    });

    it('should be catchable as a domain exception', () => {
      try {
        throw new TestDomainException('Test error');
      } catch (error) {
        expect(error).toBeInstanceOf(DomainException);
      }
    });

    it('should be catchable as a specific implementation', () => {
      expect(() => {
        throw new TestDomainException('Test error');
      }).toThrow(TestDomainException);
    });
  });
});
