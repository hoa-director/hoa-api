import { CustomError } from './custom-error';

export class DuplicateError extends CustomError {
  constructor(...params: string[]) {
    super('Duplicate Content Error', 100, ...params);
  }
}
