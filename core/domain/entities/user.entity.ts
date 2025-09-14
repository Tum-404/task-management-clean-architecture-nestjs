import { UserId } from '@core/domain/value-objects/user-id.vo';
import { Email } from '@core/shared/value-objects/email.vo';

export interface UserProps {
  id?: UserId;
  username: string;
  email: Email;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private constructor(private props: UserProps) {
    this.props.id = this.props.id || new UserId();
    this.props.createdAt = this.props.createdAt || new Date();
    this.props.updatedAt = this.props.updatedAt || new Date();
  }

  static create(
    props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>,
  ): User {
    return new User(props);
  }

  static fromPersistence(props: UserProps): User {
    return new User(props);
  }

  get id(): UserId {
    return this.props.id!;
  }

  get username(): string {
    return this.props.username;
  }

  get email(): Email {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  updateUsername(username: string): void {
    this.props.username = username;
    this.touch();
  }

  updateEmail(email: Email): void {
    this.props.email = email;
    this.touch();
  }

  updatePassword(password: string): void {
    this.props.password = password;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.props.id?.value,
      username: this.props.username,
      email: this.props.email,
      password: this.props.password,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
