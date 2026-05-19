/**
 * Interface (contrato) do repositório de transações.
 * A camada de domínio depende desta abstração, nunca da implementação concreta (DIP).
 *
 * Todas as implementações devem respeitar esta assinatura.
 */
export class ITransactionRepository {
  /**
   * Adiciona uma nova transação.
   * @param {Omit<import('../entities/Transaction').Transaction, 'id'>} transactionData
   * @returns {Promise<string>} ID gerado
   */
  // eslint-disable-next-line no-unused-vars
  async add(transactionData) {
    throw new Error('ITransactionRepository.add() não implementado.');
  }

  /**
   * Atualiza uma transação existente.
   * @param {string} id
   * @param {Partial<import('../entities/Transaction').Transaction>} data
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line no-unused-vars
  async update(id, data) {
    throw new Error('ITransactionRepository.update() não implementado.');
  }

  /**
   * Retorna uma página de transações com suporte a cursor (paginação).
   * @param {object|null} lastVisible
   * @returns {Promise<{ data: import('../entities/Transaction').Transaction[], lastVisible: object|null }>}
   */
  // eslint-disable-next-line no-unused-vars
  async getPage(lastVisible) {
    throw new Error('ITransactionRepository.getPage() não implementado.');
  }

  /**
   * Retorna todas as transações ordenadas por data (para o dashboard).
   * @returns {Promise<import('../entities/Transaction').Transaction[]>}
   */
  async getAll() {
    throw new Error('ITransactionRepository.getAll() não implementado.');
  }
}
