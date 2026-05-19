/**
 * Interface (contrato) do repositório de autenticação.
 * A camada de domínio depende desta abstração, nunca do Firebase diretamente (DIP).
 */
export class IAuthRepository {
  /**
   * @param {string} email
   * @param {string} password
   * @returns {Promise<import('firebase/auth').UserCredential>}
   */
  // eslint-disable-next-line no-unused-vars
  async signIn(email, password) {
    throw new Error('IAuthRepository.signIn() não implementado.');
  }

  /**
   * @param {string} email
   * @param {string} password
   * @returns {Promise<import('firebase/auth').UserCredential>}
   */
  // eslint-disable-next-line no-unused-vars
  async register(email, password) {
    throw new Error('IAuthRepository.register() não implementado.');
  }

  /**
   * @returns {Promise<void>}
   */
  async signOut() {
    throw new Error('IAuthRepository.signOut() não implementado.');
  }

  /**
   * @param {function} callback
   * @returns {function} unsubscribe
   */
  // eslint-disable-next-line no-unused-vars
  onAuthStateChanged(callback) {
    throw new Error('IAuthRepository.onAuthStateChanged() não implementado.');
  }
}
