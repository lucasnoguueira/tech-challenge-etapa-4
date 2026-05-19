import { ValidationError } from '../../../core/errors/AppError';
import { validateRequired, validateAmount } from '../../../core/utils/validators';

/**
 * Caso de uso: Atualizar uma transação existente.
 * Responsabilidade única: validar e delegar atualização ao repositório (SRP).
 */
export class UpdateTransactionUseCase {
  /**
   * @param {import('../../repositories/ITransactionRepository').ITransactionRepository} transactionRepository
   */
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  /**
   * @param {string} id
   * @param {{ title: string, amount: string, category: string, type: 'income'|'expense', receiptUrl?: string }} params
   * @returns {Promise<void>}
   */
  async execute(id, { title, amount, category, type, receiptUrl }) {
    const titleValidation = validateRequired(title, 'Título');
    if (!titleValidation.valid) throw new ValidationError(titleValidation.message);

    const amountValidation = validateAmount(amount);
    if (!amountValidation.valid) throw new ValidationError(amountValidation.message);

    const categoryValidation = validateRequired(category, 'Categoria');
    if (!categoryValidation.valid) throw new ValidationError(categoryValidation.message);

    const numericAmount = parseFloat(String(amount).replace(',', '.'));
    const finalAmount = type === 'expense' ? -Math.abs(numericAmount) : Math.abs(numericAmount);

    return this.transactionRepository.update(id, {
      title: title.trim(),
      amount: finalAmount,
      category,
      receiptUrl: receiptUrl || null,
    });
  }
}
