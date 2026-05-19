import { ValidationError } from '../../../core/errors/AppError';
import { validateRequired, validateAmount } from '../../../core/utils/validators';

/**
 * Caso de uso: Adicionar uma nova transação.
 * Responsabilidade única: orquestrar validação e persistência (SRP).
 */
export class AddTransactionUseCase {
  /**
   * @param {import('../../repositories/ITransactionRepository').ITransactionRepository} transactionRepository
   */
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  /**
   * @param {{ title: string, amount: string, category: string, type: 'income'|'expense', receiptUrl?: string }} params
   * @returns {Promise<string>} ID da transação criada
   */
  async execute({ title, amount, category, type, receiptUrl }) {
    const titleValidation = validateRequired(title, 'Título');
    if (!titleValidation.valid) throw new ValidationError(titleValidation.message);

    const amountValidation = validateAmount(amount);
    if (!amountValidation.valid) throw new ValidationError(amountValidation.message);

    const categoryValidation = validateRequired(category, 'Categoria');
    if (!categoryValidation.valid) throw new ValidationError(categoryValidation.message);

    const numericAmount = parseFloat(String(amount).replace(',', '.'));
    const finalAmount = type === 'expense' ? -Math.abs(numericAmount) : Math.abs(numericAmount);

    return this.transactionRepository.add({
      title: title.trim(),
      amount: finalAmount,
      category,
      date: new Date(),
      receiptUrl: receiptUrl || null,
    });
  }
}
