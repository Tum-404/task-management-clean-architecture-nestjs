import { CryptoRepositoryPort } from './crypto-repository.port';

class MockCryptoRepository implements CryptoRepositoryPort {
  async hash(password: string): Promise<string> {
    // Simple mock implementation for testing
    return await Promise.resolve(`hashed.${password}`);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    // Compare the mock hashed password format
    return await Promise.resolve(hashedPassword === `hashed.${password}`);
  }
}

describe('CryptoRepositoryPort', () => {
  let cryptoRepository: CryptoRepositoryPort;

  beforeEach(() => {
    cryptoRepository = new MockCryptoRepository();
  });

  describe('hash', () => {
    it('should hash a password', async () => {
      const password = 'mypassword123';
      const hashedPassword = await cryptoRepository.hash(password);

      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).not.toBe(password);
    });

    it('should generate different hashes for different passwords', async () => {
      const password1 = 'password1';
      const password2 = 'password2';

      const hash1 = await cryptoRepository.hash(password1);
      const hash2 = await cryptoRepository.hash(password2);

      expect(hash1).not.toBe(hash2);
    });

    it('should generate consistent hashes for the same password', async () => {
      const password = 'mypassword123';

      const hash1 = await cryptoRepository.hash(password);
      const hash2 = await cryptoRepository.hash(password);

      expect(hash1).toBe(hash2);
    });
  });

  describe('compare', () => {
    it('should return true for matching password', async () => {
      const password = 'mypassword123';
      const hashedPassword = await cryptoRepository.hash(password);

      const result = await cryptoRepository.compare(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'mypassword123';
      const wrongPassword = 'wrongpassword';
      const hashedPassword = await cryptoRepository.hash(password);

      const result = await cryptoRepository.compare(
        wrongPassword,
        hashedPassword,
      );
      expect(result).toBe(false);
    });

    it('should handle empty passwords', async () => {
      const emptyPassword = '';
      const hashedEmpty = await cryptoRepository.hash(emptyPassword);

      expect(await cryptoRepository.compare(emptyPassword, hashedEmpty)).toBe(
        true,
      );
      expect(await cryptoRepository.compare('notempty', hashedEmpty)).toBe(
        false,
      );
    });
  });
});
