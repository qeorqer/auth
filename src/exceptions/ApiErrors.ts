import { ValidationError } from 'express-validator';

export default class ApiError extends Error {
  status;
  errors;

  constructor(status: number, message: string, errors: Error[] | ValidationError[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, 'User is unauthorized');
  }

  static BadRequest(message: string, errors: Error[] | ValidationError[] = []) {
    return new ApiError(400, message, errors);
  }

  static Forbidden(message: string, errors: Error[] | ValidationError[] = []) {
    return new ApiError(403, message, errors);
  }

  static ServerError(message: string, errors: Error[] | ValidationError[] = []) {
    return new ApiError(500, message, errors);
  }
};
