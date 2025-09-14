import { v4 as uuidv4 } from 'uuid';
import { Uuid } from 'core/shared/value-objects/uuid.vo';

// Create a concrete implementation of the abstract Uuid class for testing
class TestUuid extends Uuid {
  constructor(value?: string) {
    super(value);
  }
}

describe('Uuid', () => {
  describe('constructor', () => {
    it('should create a new UUID when no value is provided', () => {
      const uuid = new TestUuid();
      expect(uuid.value).toBeDefined();
      expect(typeof uuid.value).toBe('string');
      expect(uuid.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should use the provided UUID value', () => {
      const existingUuid = uuidv4();
      const uuid = new TestUuid(existingUuid);
      expect(uuid.value).toBe(existingUuid);
    });

    it('should throw an error when provided UUID is empty', () => {
      expect(() => new TestUuid('')).toThrow('Uuid cannot be empty');
    });

    it('should generate a new UUID when value is undefined', () => {
      const uuid = new TestUuid(undefined);
      expect(uuid.value).toBeDefined();
      expect(typeof uuid.value).toBe('string');
      expect(uuid.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe('value', () => {
    it('should return the UUID value', () => {
      const existingUuid = uuidv4();
      const uuid = new TestUuid(existingUuid);
      expect(uuid.value).toBe(existingUuid);
    });
  });

  describe('equals', () => {
    it('should return true when comparing same UUID values', () => {
      const existingUuid = uuidv4();
      const uuid1 = new TestUuid(existingUuid);
      const uuid2 = new TestUuid(existingUuid);
      expect(uuid1.equals(uuid2)).toBe(true);
    });

    it('should return false when comparing different UUID values', () => {
      const uuid1 = new TestUuid();
      const uuid2 = new TestUuid();
      expect(uuid1.equals(uuid2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string representation of the UUID', () => {
      const existingUuid = uuidv4();
      const uuid = new TestUuid(existingUuid);
      expect(uuid.toString()).toBe(existingUuid);
    });

    it('should match the value property', () => {
      const uuid = new TestUuid();
      expect(uuid.toString()).toBe(uuid.value);
    });
  });
});
