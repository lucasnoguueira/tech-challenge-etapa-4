/**
 * Validadores de input centralizados (DRY, SRP).
 * Cada função valida uma regra específica e retorna { valid, message }.
 */

/**
 * @param {string} email
 * @returns {{ valid: boolean, message: string }}
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !email.trim()) {
    return { valid: false, message: 'O e-mail é obrigatório.' };
  }
  if (!regex.test(email)) {
    return { valid: false, message: 'Informe um e-mail válido.' };
  }
  return { valid: true, message: '' };
};

/**
 * @param {string} password
 * @returns {{ valid: boolean, message: string }}
 */
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, message: 'A senha é obrigatória.' };
  }
  if (password.length < 6) {
    return { valid: false, message: 'A senha deve ter no mínimo 6 caracteres.' };
  }
  return { valid: true, message: '' };
};

/**
 * @param {string} confirmPassword
 * @param {string} password
 * @returns {{ valid: boolean, message: string }}
 */
export const validatePasswordConfirmation = (confirmPassword, password) => {
  if (confirmPassword !== password) {
    return { valid: false, message: 'As senhas não coincidem.' };
  }
  return { valid: true, message: '' };
};

/**
 * @param {string} amount
 * @returns {{ valid: boolean, message: string }}
 */
export const validateAmount = (amount) => {
  if (!amount || !amount.trim()) {
    return { valid: false, message: 'O valor é obrigatório.' };
  }
  const numeric = parseFloat(amount.replace(',', '.'));
  if (isNaN(numeric) || numeric <= 0) {
    return { valid: false, message: 'Informe um valor numérico positivo.' };
  }
  return { valid: true, message: '' };
};

/**
 * @param {string} text
 * @param {string} fieldName
 * @returns {{ valid: boolean, message: string }}
 */
export const validateRequired = (text, fieldName) => {
  if (!text || !text.trim()) {
    return { valid: false, message: `${fieldName} é obrigatório.` };
  }
  return { valid: true, message: '' };
};
