import { User } from '@core/domain/entities/user.entity';

export interface AuthServicePort {
  generateAccessToken(user: User): Promise<string>;
}
