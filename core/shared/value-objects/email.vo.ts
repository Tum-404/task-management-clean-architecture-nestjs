export class Email {
  protected constructor(private readonly _email: string) {
    if (!_email) {
      throw new Error('Email cannot be empty');
    }
  }

  static create(email: string): Email {
    if (!Email.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    return new Email(email);
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  get value(): string {
    return this._email;
  }

  equals(other: Email): boolean {
    return this._email === other._email;
  }

  toString(): string {
    return this._email;
  }
}
