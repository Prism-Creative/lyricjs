export class LyricApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly errorCode?: string,
    public readonly response?: any,
  ) {
    super(message);
    this.name = 'LyricApiError';
  }
}

export class LyricAuthenticationError extends LyricApiError {
  constructor(message = 'Authentication failed', response?: any) {
    super(message, 401, 'AUTH_ERROR', response);
    this.name = 'LyricAuthenticationError';
  }
}

export class LyricValidationError extends LyricApiError {
  constructor(message: string, response?: any) {
    super(message, 400, 'VALIDATION_ERROR', response);
    this.name = 'LyricValidationError';
  }
}

export class LyricNotFoundError extends LyricApiError {
  constructor(message: string, response?: any) {
    super(message, 404, 'NOT_FOUND', response);
    this.name = 'LyricNotFoundError';
  }
}

export class LyricNetworkError extends LyricApiError {
  constructor(message = 'Network error occurred', response?: any) {
    super(message, 0, 'NETWORK_ERROR', response);
    this.name = 'LyricNetworkError';
  }
}
