import { UserEmail } from './user-email.vo';
import { Email } from '@core/shared/value-objects/email.vo';

describe('UserEmail', () => {
  describe('creation', () => {
    it('should create a valid UserEmail', () => {
      const email = 'test@example.com';
      const userEmail = UserEmail.create(email);
      expect(userEmail).toBeDefined();
      expect(userEmail.toString()).toBe(email);
    });

    it('should extend Email class', () => {
      const userEmail = UserEmail.create('test@example.com');
      expect(userEmail).toBeInstanceOf(Email);
    });

    it('should throw error for invalid email format', () => {
      const invalidEmails = [
        'test',
        'test@',
        '@example.com',
        'test@example',
        'test@.com',
        '@.',
        'test@example.',
        '',
      ];

      invalidEmails.forEach((email) => {
        expect(() => UserEmail.create(email)).toThrow('Invalid email format');
      });
    });

    it('should accept valid email formats', () => {
      const validEmails = [
        'simple@example.com',
        'very.common@example.com',
        'disposable.style.email.with+symbol@example.com',
        'other.email-with-hyphen@example.com',
        'fully-qualified-domain@example.com',
        'user.name+tag+sorting@example.com',
        'x@example.com',
        'example-indeed@strange-example.com',
        'example@s.example',
      ];

      validEmails.forEach((email) => {
        expect(() => UserEmail.create(email)).not.toThrow();
      });
    });
  });

  describe('value object behavior', () => {
    it('should treat two UserEmails with same value as equal', () => {
      const email = 'test@example.com';
      const userEmail1 = UserEmail.create(email);
      const userEmail2 = UserEmail.create(email);
      expect(userEmail1.equals(userEmail2)).toBe(true);
    });

    it('should treat two UserEmails with different values as not equal', () => {
      const userEmail1 = UserEmail.create('test1@example.com');
      const userEmail2 = UserEmail.create('test2@example.com');
      expect(userEmail1.equals(userEmail2)).toBe(false);
    });

    it('should provide string representation', () => {
      const email = 'test@example.com';
      const userEmail = UserEmail.create(email);
      expect(userEmail.toString()).toBe(email);
    });
  });

  describe('immutability', () => {
    it('should be immutable', () => {
      const userEmail = UserEmail.create('test@example.com');
      const value = userEmail.toString();

      // The value property should be read-only
      expect(() => {
        // @ts-expect-error - Testing immutability
        userEmail.value = 'new@example.com';
      }).toThrow(TypeError);

      expect(userEmail.toString()).toBe(value);
    });
  });

  describe('case sensitivity', () => {
    it('should preserve email case', () => {
      const lowerEmail = 'test@example.com';
      const upperEmail = 'TEST@EXAMPLE.COM';
      const mixedEmail = 'Test@Example.com';

      const userEmail1 = UserEmail.create(lowerEmail);
      const userEmail2 = UserEmail.create(upperEmail);
      const userEmail3 = UserEmail.create(mixedEmail);

      // Should preserve original case in toString
      expect(userEmail1.toString()).toBe(lowerEmail);
      expect(userEmail2.toString()).toBe(upperEmail);
      expect(userEmail3.toString()).toBe(mixedEmail);

      // Should not be treated as equal since we're preserving case
      expect(userEmail1.equals(userEmail2)).toBe(false);
      expect(userEmail2.equals(userEmail3)).toBe(false);
      expect(userEmail1.equals(userEmail3)).toBe(false);
    });

    it('should allow case-insensitive comparison if needed', () => {
      const email1 = UserEmail.create('test@example.com');
      const email2 = UserEmail.create('TEST@EXAMPLE.COM');

      // Custom case-insensitive comparison if needed
      const caseInsensitiveEquals = (e1: UserEmail, e2: UserEmail) =>
        e1.toString().toLowerCase() === e2.toString().toLowerCase();

      expect(caseInsensitiveEquals(email1, email2)).toBe(true);
    });
  });
});
