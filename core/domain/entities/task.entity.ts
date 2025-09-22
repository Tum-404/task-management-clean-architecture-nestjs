import { TaskId } from '@core/domain/value-objects/task-id.vo';
import { UserId } from '@core/domain/value-objects/user-id.vo';

export interface TaskProps {
  id?: TaskId;
  title: string;
  description?: string;
  completed: boolean;
  userId: UserId;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Task {
  private constructor(private props: TaskProps) {
    this.props.id = this.props.id || new TaskId();
    this.props.createdAt = this.props.createdAt || new Date();
    this.props.updatedAt = this.props.updatedAt || new Date();
  }

  static create(
    props: Omit<TaskProps, 'id' | 'createdAt' | 'updatedAt'>,
  ): Task {
    return new Task(props);
  }

  static fromPersistence(props: TaskProps): Task {
    return new Task(props);
  }

  get id(): TaskId {
    return this.props.id!;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get completed(): boolean {
    return this.props.completed;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get userId(): UserId {
    return this.props.userId;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  updateTitle(title: string): void {
    this.props.title = title;
    this.touch();
  }

  updateDescription(description?: string): void {
    this.props.description = description;
    this.touch();
  }

  markAsCompleted(): void {
    this.props.completed = true;
    this.touch();
  }

  markAsIncomplete(): void {
    this.props.completed = false;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.props.id?.value,
      title: this.props.title,
      description: this.props.description,
      completed: this.props.completed,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
