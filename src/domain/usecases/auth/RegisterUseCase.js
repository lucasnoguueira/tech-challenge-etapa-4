import { AuthError } from '../../../core/errors/AppError';
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
} from '../../../core/utils/validators';

/**
 * Caso de uso: Registrar novo usuário com confirmação de senha (SRP).
 */
export class RegisterUseCase {
  /**
   * @param {import('../../repositories/IAuthRepository').IAuthRepository} authRepository
   */
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  /**
   * @param {string} email
   * @param {string} password
   * @param {string} confirmPassword
   * @returns {Promise<import('firebase/auth').UserCredential>}
   */
  async execute(email, password, confirmPassword) {
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) throw new AuthError(emailValidation.message);

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) throw new AuthError(passwordValidation.message);

    const confirmValidation = validatePasswordConfirmation(confirmPassword, password);
    if (!confirmValidation.valid) throw new AuthError(confirmValidation.message);

    return this.authRepository.register(email, password);
  }
}
