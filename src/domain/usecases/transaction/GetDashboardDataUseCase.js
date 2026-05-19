import COLORS from '../../../core/constants/colors';
import { formatChartLabel } from '../../../core/utils/formatters';

/**
 * Converte qualquer formato de data para Date (incluindo Timestamps serializados).
 * @param {any} date
 * @returns {Date}
 */
const toDate = (date) => {
  if (!date) return new Date(0);
  if (typeof date.toDate === 'function') return date.toDate();
  if (typeof date === 'object' && typeof date.seconds === 'number') return new Date(date.seconds * 1000);
  if (date instanceof Date) return date;
  return new Date(date);
};

/**
 * Caso de uso: Calcular dados do Dashboard.
 * Encapsula toda a lógica de negócio: saldo, gráficos e distribuição por categoria (SRP).
 */
export class GetDashboardDataUseCase {
  /**
   * @param {import('../../repositories/ITransactionRepository').ITransactionRepository} transactionRepository
   */
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  /**
   * @returns {Promise<{
   *   balance: number,
   *   lineData: object,
   *   pieData: object[],
   *   totalIncome: number,
   *   totalExpenses: number
   * }>}
   */
  async execute() {
    const transactions = await this.transactionRepository.getAll();

    const sorted = [...transactions].sort((a, b) => toDate(a.date) - toDate(b.date));

    // Saldo acumulado e totais
    let balance = 0;
    let totalIncome = 0;
    let totalExpenses = 0;

    const historyData = sorted.map((item) => {
      balance += item.amount;
      if (item.amount > 0) totalIncome += item.amount;
      else totalExpenses += Math.abs(item.amount);
      return { ...item, balanceAfter: balance };
    });

    // Distribuição por categoria (apenas despesas)
    const categoryMap = {};
    transactions.forEach((t) => {
      if (t.amount < 0) {
        const cat = t.category || 'Outros';
        categoryMap[cat] = (categoryMap[cat] || 0) + Math.abs(t.amount);
      }
    });

    const pieData = Object.keys(categoryMap).map((cat, index) => ({
      name: cat,
      population: categoryMap[cat],
      color: COLORS.chartColors[index % COLORS.chartColors.length],
      legendFontColor: COLORS.textLight,
      legendFontSize: 12,
    }));

    // Gráfico de linha: últimas 6 transações com saldo acumulado
    const recent = historyData.slice(-6);
    const lineData =
      recent.length > 0
        ? {
            labels: recent.map((d) => formatChartLabel(d.date)),
            datasets: [
              {
                data: recent.map((d) => d.balanceAfter),
                color: () => COLORS.primary,
                strokeWidth: 2,
              },
            ],
          }
        : null;

    return { balance, lineData, pieData, totalIncome, totalExpenses };
  }
}
