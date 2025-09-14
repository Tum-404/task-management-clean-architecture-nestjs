import { UseCase } from '@core/shared/interfaces/use-case.interface';
import { SignUpUserDto } from '@core/application/dtos/signup-user.dto';
import { User } from '@core/domain/entities/user.entity';
import { UserRepositoryPort } from '@core/application/ports/user-repository.port';
import { Email } from '@core/shared/value-objects/email.vo';
import { UserEmailAlreadyExistsException } from '@core/shared/exceptions/user-email-exists.exception';
import { CryptoRepositoryPort } from '@core/application/ports/crypto-repository.port';

export class SignUpUserUseCase implements UseCase<SignUpUserDto, User> {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly cryptoRepository: CryptoRepositoryPort,
  ) {}

  async execute(dto: SignUpUserDto): Promise<User> {
    const userEmail = Email.create(dto.email);
    const existingUser = await this.userRepository.findByEmail(userEmail);

    if (existingUser) {
      throw new UserEmailAlreadyExistsException(userEmail);
    }

    const hashedPassword = await this.cryptoRepository.hash(dto.password);

    const user = User.create({
      email: userEmail,
      username: dto.username,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }
}
