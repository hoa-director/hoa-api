import { CustomError } from './custom-error';

export class DuplicateError extends CustomError {
  constructor(...params) {
    super('Duplicate Content Error', 100, ...params);
  }
}
