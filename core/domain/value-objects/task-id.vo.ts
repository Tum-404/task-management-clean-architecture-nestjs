import { v4 as uuidv4 } from 'uuid';
import { Uuid } from '@core/shared/value-objects/uuid.vo';

export class TaskId extends Uuid {
  constructor(value: string = uuidv4()) {
    if (!value) {
      throw new Error('Task ID cannot be empty');
    }
    super(value);
  }
}
