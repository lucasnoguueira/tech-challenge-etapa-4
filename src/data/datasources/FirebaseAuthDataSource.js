import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { AuthError } from '../../core/errors/AppError';

/**
 * Fonte de dados: acesso direto ao Firebase Authentication.
 * Isola toda a lógica de autenticação Firebase (SRP).
 */
export class FirebaseAuthDataSource {
  /**
   * @param {string} email
   * @param {string} password
   * @returns {Promise<import('firebase/auth').UserCredential>}
   */
  async signIn(email, password) {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new AuthError(this._mapFirebaseError(error.code), error.code);
    }
  }

  /**
   * @param {string} email
   * @param {string} password
   * @returns {Promise<import('firebase/auth').UserCredential>}
   */
  async register(email, password) {
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new AuthError(this._mapFirebaseError(error.code), error.code);
    }
  }

  /**
   * @returns {Promise<void>}
   */
  async signOut() {
    try {
      return await signOut(auth);
    } catch (error) {
      throw new AuthError('Erro ao encerrar sessão.');
    }
  }

  /**
   * @param {function} callback
   * @returns {function} unsubscribe
   */
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Traduz códigos de erro do Firebase para mensagens amigáveis.
   * @param {string} code
   * @returns {string}
   */
  _mapFirebaseError(code) {
    const errors = {
      'auth/user-not-found': 'Usuário não encontrado.',
      'auth/wrong-password': 'Senha incorreta.',
      'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
      'auth/invalid-email': 'E-mail inválido.',
      'auth/weak-password': 'A senha deve ter no mínimo 6 caracteres.',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
      'auth/invalid-credential': 'Credenciais inválidas. Verifique e-mail e senha.',
    };
    return errors[code] || 'Erro de autenticação. Tente novamente.';
  }
}
