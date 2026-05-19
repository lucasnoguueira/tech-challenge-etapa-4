/**
 * Caso de uso: Encerrar sessão do usuário (SRP).
 */
export class SignOutUseCase {
  /**
   * @param {import('../../repositories/IAuthRepository').IAuthRepository} authRepository
   */
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  /**
   * @returns {Promise<void>}
   */
  async execute() {
    return this.authRepository.signOut();
  }
}
