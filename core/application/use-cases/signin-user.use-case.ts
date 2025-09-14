import { SignInUserDto } from '@core/application/dtos/signin-user.dto';
import { UserRepositoryPort } from '@core/application/ports/user-repository.port';
import { CryptoRepositoryPort } from '@core/application/ports/crypto-repository.port';
import { Email } from '@core/shared/value-objects/email.vo';
import { AuthServicePort } from '@core/application/ports/auth-service.port';
import { InvalidUserCredentialException } from '@core/shared/exceptions/invalid-user-credentail.exception';

export class SignInUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly cryptoRepository: CryptoRepositoryPort,
    private readonly authService: AuthServicePort,
  ) {}

  async execute(
    signInUserDto: SignInUserDto,
  ): Promise<{ accessToken: string }> {
    const userEmail = Email.create(signInUserDto.email);
    const { password } = signInUserDto;

    const user = await this.userRepository.findByEmail(userEmail);

    if (!user) {
      throw new InvalidUserCredentialException('User not found');
    }

    const isPasswordValid = await this.cryptoRepository.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new InvalidUserCredentialException('User not found');
    }

    const accessToken = await this.authService.generateAccessToken(user);
    return { accessToken };
  }
}
