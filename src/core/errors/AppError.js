/**
 * Hierarquia de erros tipados da aplicação.
 * Permite tratamento diferenciado por tipo de erro (SRP).
 */

export class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'AppError';
    this.code = code || 'UNKNOWN_ERROR';
  }
}

export class AuthError extends AppError {
  constructor(message, code) {
    super(message, code || 'AUTH_ERROR');
    this.name = 'AuthError';
  }
}

export class NetworkError extends AppError {
  constructor(message) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}
