import { AuthError } from '../../../core/errors/AppError';
import { validateEmail, validatePassword } from '../../../core/utils/validators';

/**
 * Caso de uso: Autenticar usuário existente (SRP).
 */
export class SignInUseCase {
  /**
   * @param {import('../../repositories/IAuthRepository').IAuthRepository} authRepository
   */
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  /**
   * @param {string} email
   * @param {string} password
   * @returns {Promise<import('firebase/auth').UserCredential>}
   */
  async execute(email, password) {
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) throw new AuthError(emailValidation.message);

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) throw new AuthError(passwordValidation.message);

    return this.authRepository.signIn(email, password);
  }
}
