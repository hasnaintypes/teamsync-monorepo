import { HTTP_STATUS, HttpStatusCodeType } from "../config/http.config";
import { ErrorCodeEnum, ErrorCodeEnumType } from "../enums/error-code.enum";

/**
 * Base class for application-specific errors.
 * Extends the built-in Error class to include HTTP status and a custom error code.
 */
export class AppError extends Error {
  public statusCode: HttpStatusCodeType;
  public errorCode?: ErrorCodeEnumType;

  /**
   * @param message - Human-readable error message.
   * @param statusCode - HTTP status code (defaults to 500).
   * @param errorCode - Custom error code from ErrorCodeEnum (optional).
   */
  constructor(
    message: string,
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errorCode?: ErrorCodeEnumType
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * A generic HTTP exception.
 * Useful for throwing an HTTP error with a custom status and optional code.
 */
export class HttpException extends AppError {
  /**
   * @param message - Optional custom message.
   * @param statusCode - HTTP status code.
   * @param errorCode - Optional error code.
   */
  constructor(
    message = "Http Exception Error",
    statusCode: HttpStatusCodeType,
    errorCode?: ErrorCodeEnumType
  ) {
    super(message, statusCode, errorCode);
  }
}

/**
 * Represents a 500 Internal Server Error.
 */
export class InternalServerException extends AppError {
  /**
   * @param message - Optional custom message.
   * @param errorCode - Optional error code.
   */
  constructor(
    message = "Internal Server Error",
    errorCode?: ErrorCodeEnumType
  ) {
    super(
      message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode || ErrorCodeEnum.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * Represents a 404 Not Found error.
 */
export class NotFoundException extends AppError {
  /**
   * @param message - Optional custom message.
   * @param errorCode - Optional error code.
   */
  constructor(message = "Resource not found", errorCode?: ErrorCodeEnumType) {
    super(
      message,
      HTTP_STATUS.NOT_FOUND,
      errorCode || ErrorCodeEnum.RESOURCE_NOT_FOUND
    );
  }
}

/**
 * Represents a 400 Bad Request error.
 */
export class BadRequestException extends AppError {
  /**
   * @param message - Optional custom message.
   * @param errorCode - Optional error code.
   */
  constructor(message = "Bad Request", errorCode?: ErrorCodeEnumType) {
    super(
      message,
      HTTP_STATUS.BAD_REQUEST,
      errorCode || ErrorCodeEnum.VALIDATION_ERROR
    );
  }
}

/**
 * Represents a 401 Unauthorized error.
 */
export class UnauthorizedException extends AppError {
  /**
   * @param message - Optional custom message.
   * @param errorCode - Optional error code.
   */
  constructor(message = "Unauthorized Access", errorCode?: ErrorCodeEnumType) {
    super(
      message,
      HTTP_STATUS.UNAUTHORIZED,
      errorCode || ErrorCodeEnum.ACCESS_UNAUTHORIZED
    );
  }
}
