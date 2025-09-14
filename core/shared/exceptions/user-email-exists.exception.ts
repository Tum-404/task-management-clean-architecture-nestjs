import { UserEmail } from '@core/domain/value-objects/user-email.vo';
import { DomainException } from './domain.exception';

export class UserEmailAlreadyExistsException extends DomainException {
  constructor(email: UserEmail) {
    super(`User with email ${email.toString()} already exists`);
  }
}
