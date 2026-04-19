export class AppError extends Error {
  readonly name = "AppError";

  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: string = "ERROR",
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
