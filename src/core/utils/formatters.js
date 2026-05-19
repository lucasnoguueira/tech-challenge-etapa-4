/**
 * Utilitários de formatação centralizados (DRY).
 * Evita lógica de formatação duplicada nas telas.
 */

/**
 * Converte qualquer formato de data (Firestore Timestamp, objeto serializado,
 * Date ou string) para um objeto Date válido.
 *
 * Quando dados passam pelo cache JSON (stringify/parse), os Firestore Timestamps
 * perdem o método .toDate() e se tornam objetos planos { seconds, nanoseconds }.
 * Esta função cobre todos os casos.
 *
 * @param {any} date
 * @returns {Date|null}
 */
const toDateObject = (date) => {
  if (!date) return null;

  // Firestore Timestamp ativo (tem método .toDate())
  if (typeof date.toDate === 'function') return date.toDate();

  // Objeto serializado do Firestore Timestamp { seconds, nanoseconds }
  if (typeof date === 'object' && typeof date.seconds === 'number') {
    return new Date(date.seconds * 1000);
  }

  // Date nativo
  if (date instanceof Date) return date;

  // String ou número
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Formata um valor numérico para moeda BRL.
 * @param {number} value
 * @returns {string}
 */
export const formatCurrency = (value) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

/**
 * Formata uma data para string localizada pt-BR.
 * Suporta Timestamp do Firestore (ativo ou serializado), Date e string.
 * @param {any} date
 * @returns {string}
 */
export const formatDate = (date) => {
  const dateObj = toDateObject(date);
  if (!dateObj) return 'Data inválida';
  return dateObj.toLocaleDateString('pt-BR');
};

/**
 * Formata uma data para label curto de gráfico (dd/MM).
 * Suporta Timestamp do Firestore (ativo ou serializado), Date e string.
 * @param {any} date
 * @returns {string}
 */
export const formatChartLabel = (date) => {
  const dateObj = toDateObject(date);
  if (!dateObj) return '--';
  return `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
};
