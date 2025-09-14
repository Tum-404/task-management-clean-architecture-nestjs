import { v4 as uuidv4 } from 'uuid';

export abstract class Uuid {
  constructor(value?: string) {
    if (value === undefined) {
      this._value = uuidv4();
    } else if (!value) {
      throw new Error('Uuid cannot be empty');
    } else {
      this._value = value;
    }
  }

  private readonly _value: string;

  get value(): string {
    return this._value;
  }

  equals(other: Uuid): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
