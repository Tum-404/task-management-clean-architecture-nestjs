import { UserId } from './user-id.vo';
import { Uuid } from '@core/shared/value-objects/uuid.vo';
import { v4 as uuidv4 } from 'uuid';

describe('UserId', () => {
  describe('constructor', () => {
    it('should create a new UserId with auto-generated UUID when no value provided', () => {
      const userId = new UserId();
      expect(userId.value).toBeDefined();
      expect(userId.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should create a UserId with provided UUID value', () => {
      const uuid = uuidv4();
      const userId = new UserId(uuid);
      expect(userId.value).toBe(uuid);
    });

    it('should throw error when provided value is empty', () => {
      expect(() => new UserId('')).toThrow('User ID cannot be empty');
    });

    it('should extend Uuid class', () => {
      const userId = new UserId();
      expect(userId).toBeInstanceOf(Uuid);
    });
  });

  describe('value object behavior', () => {
    it('should treat two UserIds with same value as equal', () => {
      const uuid = uuidv4();
      const userId1 = new UserId(uuid);
      const userId2 = new UserId(uuid);
      expect(userId1.equals(userId2)).toBe(true);
    });

    it('should treat two UserIds with different values as not equal', () => {
      const userId1 = new UserId();
      const userId2 = new UserId();
      expect(userId1.equals(userId2)).toBe(false);
    });

    it('should provide string representation', () => {
      const uuid = uuidv4();
      const userId = new UserId(uuid);
      expect(userId.toString()).toBe(uuid);
    });
  });

  describe('comparison with other UUID types', () => {
    it('should be able to compare with other Uuid-based value objects', () => {
      const uuid = uuidv4();
      const userId = new UserId(uuid);
      const genericUuid = new (class extends Uuid {
        constructor() {
          super(uuid);
        }
      })();

      expect(userId.equals(genericUuid)).toBe(true);
    });
  });
});
