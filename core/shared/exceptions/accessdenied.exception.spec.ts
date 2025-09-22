import { AccessDeniedException } from './accessdenied.exception';
import { DomainException } from './domain.exception';

describe('AccessDeniedException', () => {
  it('should be an instance of DomainException', () => {
    const exception = new AccessDeniedException();
    expect(exception).toBeInstanceOf(DomainException);
  });

  it('should have a proper error message', () => {
    const exception = new AccessDeniedException();
    expect(exception.message).toBe(
      'Access denied: You do not have permission to perform this action',
    );
  });
});
