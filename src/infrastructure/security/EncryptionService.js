/**
 * Serviço de criptografia para dados sensíveis armazenados localmente.
 * Utiliza algoritmo XOR com chave derivada para proteger o cache (SRP).
 *
 * Nota: Esta implementação usa cifra XOR com chave estendida, adequada para
 * proteção de dados em cache local. Para dados em trânsito, utilize HTTPS (já
 * garantido pelo Firebase SDK).
 */

const SECRET_KEY = 'tc3_finance_secure_2024';

/**
 * Gera uma chave de bytes a partir da string secreta.
 * @param {number} length
 * @returns {number[]}
 */
const deriveKey = (length) => {
  const key = [];
  for (let i = 0; i < length; i++) {
    key.push(SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
  }
  return key;
};

export class EncryptionService {
  /**
   * Criptografa uma string usando XOR com chave derivada.
   * @param {string} text
   * @returns {string} — string em Base64
   */
  static encrypt(text) {
    try {
      const textBytes = [];
      for (let i = 0; i < text.length; i++) {
        textBytes.push(text.charCodeAt(i));
      }
      const key = deriveKey(textBytes.length);
      const encrypted = textBytes.map((byte, i) => byte ^ key[i]);
      // Converte para Base64 de forma compatível com React Native
      return btoa(String.fromCharCode(...encrypted));
    } catch {
      // Fallback: retorna texto sem criptografia para não quebrar o cache
      return btoa(unescape(encodeURIComponent(text)));
    }
  }

  /**
   * Descriptografa uma string em Base64 usando XOR com chave derivada.
   * @param {string} encryptedBase64
   * @returns {string}
   */
  static decrypt(encryptedBase64) {
    try {
      const encrypted = atob(encryptedBase64)
        .split('')
        .map((c) => c.charCodeAt(0));
      const key = deriveKey(encrypted.length);
      const decrypted = encrypted.map((byte, i) => byte ^ key[i]);
      return String.fromCharCode(...decrypted);
    } catch {
      // Fallback: tenta decodificar como Base64 simples
      return decodeURIComponent(escape(atob(encryptedBase64)));
    }
  }
}
