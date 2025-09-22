import { User } from '@core/domain/entities/user.entity';
import { Email } from '@core/shared/value-objects/email.vo';
import { SignInUserDto } from '../dtos/signin-user.dto';
import { SignInUserUseCase } from './signin-user.use-case';
import { UserRepositoryPort } from '../ports/user-repository.port';
import { CryptoRepositoryPort } from '../ports/crypto-repository.port';
import { AuthServicePort } from '../ports/auth-service.port';
import { InvalidUserCredentialException } from '@core/shared/exceptions/invalid-user-credentail.exception';

describe('SignInUserUseCase', () => {
  let useCase: SignInUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepositoryPort>;
  let mockCryptoRepository: jest.Mocked<CryptoRepositoryPort>;
  let mockAuthService: jest.Mocked<AuthServicePort>;

  beforeEach(() => {
    mockUserRepository = {
      save: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockCryptoRepository = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    mockAuthService = {
      generateAccessToken: jest.fn(),
    };

    useCase = new SignInUserUseCase(
      mockUserRepository,
      mockCryptoRepository,
      mockAuthService,
    );
  });

  describe('execute', () => {
    const validDto: SignInUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = User.create({
      email: Email.create('test@example.com'),
      password: 'hashedPassword',
      username: 'testuser',
    });

    it('should authenticate user with valid credentials', async () => {
      mockUserRepository.findByEmail.mockResolvedValueOnce(mockUser);
      mockCryptoRepository.compare.mockResolvedValueOnce(true);
      mockAuthService.generateAccessToken.mockResolvedValueOnce(
        'jwt.token.here',
      );

      const result = await useCase.execute(validDto);

      const findUserByEmailArg =
        mockUserRepository.findByEmail.mock.calls[0][0];

      expect(findUserByEmailArg).toEqual(
        expect.objectContaining({ value: validDto.email }),
      );

      const compareArg1 = mockCryptoRepository.compare.mock.calls[0][0];
      expect(compareArg1).toEqual(validDto.password, mockUser.password);

      const generateAccessTokenArg =
        mockAuthService.generateAccessToken.mock.calls[0][0];
      expect(generateAccessTokenArg).toEqual(mockUser);
      expect(result).toEqual({ accessToken: 'jwt.token.here' });
    });

    it('should throw when user not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValueOnce(null);

      await expect(useCase.execute(validDto)).rejects.toThrow(
        InvalidUserCredentialException,
      );

      expect(mockCryptoRepository.compare).not.toHaveBeenCalled();
      expect(mockAuthService.generateAccessToken).not.toHaveBeenCalled();
    });

    it('should throw when password is invalid', async () => {
      mockUserRepository.findByEmail.mockResolvedValueOnce(mockUser);
      mockCryptoRepository.compare.mockResolvedValueOnce(false);

      await expect(useCase.execute(validDto)).rejects.toThrow(
        InvalidUserCredentialException,
      );
      expect(mockAuthService.generateAccessToken).not.toHaveBeenCalled();
    });

    it('should validate email format', async () => {
      const invalidEmailDto = {
        email: 'invalid-email',
        password: 'password123',
      };

      await expect(useCase.execute(invalidEmailDto)).rejects.toThrow();
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('should not store sensitive data in error messages', async () => {
      mockUserRepository.findByEmail.mockResolvedValueOnce(null);

      const action = async () => {
        await useCase.execute(validDto);
      };

      await expect(action()).rejects.toThrow();
      await expect(action()).rejects.not.toThrow(new RegExp(validDto.email));
      await expect(action()).rejects.not.toThrow(new RegExp(validDto.password));
    });
  });
});
