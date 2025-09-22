import { DomainException } from './domain.exception';

export class AccessDeniedException extends DomainException {
  constructor() {
    super('Access denied: You do not have permission to perform this action');
  }
}
