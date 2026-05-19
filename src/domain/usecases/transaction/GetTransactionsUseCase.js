/**
 * Caso de uso: Buscar página de transações (com suporte a paginação por cursor).
 * Responsabilidade única: orquestrar busca paginada (SRP).
 */
export class GetTransactionsUseCase {
  /**
   * @param {import('../../repositories/ITransactionRepository').ITransactionRepository} transactionRepository
   */
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  /**
   * @param {object|null} lastVisible — cursor para paginação
   * @returns {Promise<{ data: import('../../entities/Transaction').Transaction[], lastVisible: object|null }>}
   */
  async execute(lastVisible = null) {
    return this.transactionRepository.getPage(lastVisible);
  }
}
