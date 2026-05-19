import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';

/**
 * Implementação concreta do repositório de transações.
 * Integra o DataSource com o serviço de Cache (SRP, DIP, OCP).
 */
export class TransactionRepositoryImpl extends ITransactionRepository {
  /**
   * @param {import('../datasources/FirebaseTransactionDataSource').FirebaseTransactionDataSource} dataSource
   * @param {import('../../infrastructure/cache/CacheService').CacheService} cacheService
   */
  constructor(dataSource, cacheService) {
    super();
    this.dataSource = dataSource;
    this.cacheService = cacheService;
  }

  /**
   * Chave de cache para todas as transações (dashboard).
   */
  get _allCacheKey() {
    return 'transactions_all';
  }

  /**
   * @param {object} data
   * @returns {Promise<string>}
   */
  async add(data) {
    const id = await this.dataSource.add(data);
    await this.cacheService.invalidate(this._allCacheKey);
    return id;
  }

  /**
   * @param {string} id
   * @param {object} data
   * @returns {Promise<void>}
   */
  async update(id, data) {
    await this.dataSource.update(id, data);
    await this.cacheService.invalidate(this._allCacheKey);
  }

  /**
   * @param {object|null} lastVisible
   * @returns {Promise<{ data: object[], lastVisible: object|null }>}
   */
  async getPage(lastVisible = null) {
    return this.dataSource.getPage(lastVisible);
  }

  /**
   * Busca todas as transações com suporte a cache (TTL: 5 minutos).
   * @returns {Promise<object[]>}
   */
  async getAll() {
    const cached = await this.cacheService.get(this._allCacheKey);
    if (cached) return cached;

    const data = await this.dataSource.getAll();
    await this.cacheService.set(this._allCacheKey, data, 5 * 60);
    return data;
  }
}
