import { Transaction } from '../../domain/entities/Transaction';

/**
 * Model de dados: converte entre documentos Firestore e entidades de domínio.
 * Isola o formato do banco de dados da lógica de negócio (SRP, DIP).
 */
export class TransactionModel {
  /**
   * Converte um documento Firestore para a entidade Transaction de domínio.
   * @param {string} id
   * @param {object} data — dados brutos do Firestore
   * @returns {Transaction}
   */
  static fromFirestore(id, data) {
    return new Transaction({
      id,
      userId: data.userId,
      title: data.title,
      amount: data.amount,
      category: data.category || 'Outros',
      date: data.date,
      receiptUrl: data.receiptUrl || null,
      createdAt: data.createdAt,
    });
  }

  /**
   * Converte dados de domínio para o formato de persistência do Firestore.
   * @param {Partial<Transaction>} transaction
   * @returns {object}
   */
  static toFirestore(transaction) {
    const doc = {};
    if (transaction.userId !== undefined) doc.userId = transaction.userId;
    if (transaction.title !== undefined) doc.title = transaction.title;
    if (transaction.amount !== undefined) doc.amount = transaction.amount;
    if (transaction.category !== undefined) doc.category = transaction.category;
    if (transaction.date !== undefined) doc.date = transaction.date;
    if (transaction.receiptUrl !== undefined) doc.receiptUrl = transaction.receiptUrl;
    return doc;
  }
}
