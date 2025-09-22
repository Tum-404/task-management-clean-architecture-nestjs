import { User } from '@core/domain/entit      mockUserRepository.save.mockClear();/user.entity';
import { SignUpUserDto } from '../dtos/signup-user.dto';
import { UserRepositoryPort } from '../ports/user-repository.port';
import { CryptoRepositoryPort } from '../ports/crypto-repository.port';
import { SignUpUserUseCase } from './signup-user.use-case';
import { Email } from '@core/shared/value-objects/email.vo';
import { UserEmailAlreadyExistsException } from '@core/shared/exceptions/user-email-exists.exception';

describe('SignUpUserUseCase', () => {
  let useCase: SignUpUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepositoryPort>;
  let mockCryptoRepository: jest.Mocked<CryptoRepositoryPort>;

  beforeEach(() => {
    mockUserRepository = {
      save: jest.fn().mockImplementation((user: User) => Promise.resolve(user)),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockCryptoRepository = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    useCase = new SignUpUserUseCase(mockUserRepository, mockCryptoRepository);
  });

  describe('execute', () => {
    it('should successfully create a new user', async () => {
      const dto: SignUpUserDto = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      const hashedPassword = 'hashedPassword123';
      mockCryptoRepository.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.save.mockImplementation((user: User) =>
        Promise.resolve(user),
      );

      const result = await useCase.execute(dto);

      expect(result).toBeInstanceOf(User);
      expect(result.email.value).toBe(dto.email);
      expect(result.username).toBe(dto.username);
      expect(mockCryptoRepository.hash).toHaveBeenCalledWith(dto.password);
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: expect.any(Email),
          username: dto.username,
          password: hashedPassword,
        }),
      );
    });

    it('should throw UserEmailAlreadyExistsException when email exists', async () => {
      const dto: SignUpUserDto = {
        email: 'existing@example.com',
        password: 'password123',
        username: 'existinguser',
      };

      const existingUser = User.create({
        email: Email.create(dto.email),
        username: 'otheruser',
        password: 'hashedpassword',
      });

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(useCase.execute(dto)).rejects.toThrow(
        UserEmailAlreadyExistsException,
      );
      expect(mockCryptoRepository.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should hash the password before saving', async () => {
      const dto: SignUpUserDto = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };

      const hashedPassword = 'hashedPassword123';
      mockCryptoRepository.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.save.mockImplementation((user: User) =>
        Promise.resolve(user),
      );

      const result = await useCase.execute(dto);

      expect(mockCryptoRepository.hash).toHaveBeenCalledWith(dto.password);
      expect(result.password).toBe(hashedPassword);
    });

    it('should validate email format', async () => {
      const dto: SignUpUserDto = {
        email: 'invalid-email',
        password: 'password123',
        username: 'testuser',
      };

      await expect(useCase.execute(dto)).rejects.toThrow();
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockCryptoRepository.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });
});
