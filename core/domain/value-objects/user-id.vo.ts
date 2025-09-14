import { v4 as uuidv4 } from 'uuid';
import { Uuid } from '@core/shared/value-objects/uuid.vo';

export class UserId extends Uuid {
  constructor(value: string = uuidv4()) {
    if (!value) {
      throw new Error('User ID cannot be empty');
    }
    super(value);
  }
}
