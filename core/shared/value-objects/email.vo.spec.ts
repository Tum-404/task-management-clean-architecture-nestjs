import { Email } from 'core/shared/value-objects/email.vo';

describe('Email', () => {
  describe('constructor', () => {
    it('should create a email.create with valid value', () => {
      const emailStr = 'test@example.com';
      const email = Email.create(emailStr);
      expect(email.value).toBe(emailStr);
    });

    it('should throw an error when email is invalid', () => {
      expect(() => Email.create('invalid-email')).toThrow(
        'Invalid email format',
      );
    });

    it('should throw an error when email is empty', () => {
      expect(() => Email.create('')).toThrow('Invalid email format');
    });
  });

  describe('value', () => {
    it('should return the email value', () => {
      const emailStr = 'test@example.com';
      const email = Email.create(emailStr);
      expect(email.value).toBe(emailStr);
    });
  });

  describe('equals', () => {
    it('should return true when comparing same email values', () => {
      const emailStr = 'test@example.com';
      const email1 = Email.create(emailStr);
      const email2 = Email.create(emailStr);
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false when comparing different email values', () => {
      const email1 = Email.create('test1@example.com');
      const email2 = Email.create('test2@example.com');
      expect(email1.equals(email2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string representation of the email', () => {
      const emailStr = 'test@example.com';
      const email = Email.create(emailStr);
      expect(email.toString()).toBe(emailStr);
    });

    it('should match the value property', () => {
      const emailStr = 'test@example.com';
      const email = Email.create(emailStr);
      expect(email.toString()).toBe(email.value);
    });
  });
});
