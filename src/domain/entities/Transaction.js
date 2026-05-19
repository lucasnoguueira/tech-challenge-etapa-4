/**
 * Entidade de domínio Transaction.
 * Representa uma transação financeira sem dependências de infraestrutura.
 */
export class Transaction {
  /**
   * @param {string} id
   * @param {string} userId
   * @param {string} title
   * @param {number} amount  — positivo = receita, negativo = despesa
   * @param {string} category
   * @param {Date} date
   * @param {string|null} receiptUrl
   * @param {Date} createdAt
   */
  constructor({ id, userId, title, amount, category, date, receiptUrl, createdAt }) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.amount = amount;
    this.category = category;
    this.date = date;
    this.receiptUrl = receiptUrl || null;
    this.createdAt = createdAt;
  }

  get isExpense() {
    return this.amount < 0;
  }

  get absoluteAmount() {
    return Math.abs(this.amount);
  }
}
