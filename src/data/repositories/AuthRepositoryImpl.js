import { IAuthRepository } from '../../domain/repositories/IAuthRepository';

/**
 * Implementação concreta do repositório de autenticação.
 * Delega ao DataSource e não possui lógica de negócio (SRP, DIP).
 */
export class AuthRepositoryImpl extends IAuthRepository {
  /**
   * @param {import('../datasources/FirebaseAuthDataSource').FirebaseAuthDataSource} dataSource
   */
  constructor(dataSource) {
    super();
    this.dataSource = dataSource;
  }

  async signIn(email, password) {
    return this.dataSource.signIn(email, password);
  }

  async register(email, password) {
    return this.dataSource.register(email, password);
  }

  async signOut() {
    return this.dataSource.signOut();
  }

  onAuthStateChanged(callback) {
    return this.dataSource.onAuthStateChanged(callback);
  }
}
