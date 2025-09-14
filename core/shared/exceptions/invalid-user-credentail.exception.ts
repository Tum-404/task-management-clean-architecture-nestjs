import { DomainException } from './domain.exception';

export class InvalidUserCredentialException extends DomainException {
  constructor(message: string) {
    super(`Invalid user credential: ${message}`);
  }
}
