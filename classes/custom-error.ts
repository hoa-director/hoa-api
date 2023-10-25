export class CustomError extends Error {
  date: Date;
  name: string;
  id: number | undefined;
  constructor(name: string, id: number | undefined, ...params: any) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    // Custom debugging information
    this.date = new Date();
    this.name = name;
    this.id = id;
  }
}
