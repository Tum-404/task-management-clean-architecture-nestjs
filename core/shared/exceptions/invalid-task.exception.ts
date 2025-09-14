import { DomainException } from './domain.exception';

export class InvalidTaskDataException extends DomainException {
  constructor(message: string) {
    super(`Invalid task data: ${message}`);
  }
}
