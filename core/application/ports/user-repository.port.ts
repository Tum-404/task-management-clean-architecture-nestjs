import { User } from '@core/domain/entities/user.entity';
import { UserId } from '@core/domain/value-objects/user-id.vo';
import { Email } from '@core/shared/value-objects/email.vo';

export interface UserRepositoryPort {
  save(user: User): Promise<User>;
  findByEmail(email: Email): Promise<User | null>;
  update(user: User): Promise<User>;
  delete(id: UserId): Promise<void>;
}
