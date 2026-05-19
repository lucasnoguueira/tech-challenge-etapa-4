import AsyncStorage from '@react-native-async-storage/async-storage';
import { EncryptionService } from '../security/EncryptionService';

const CACHE_PREFIX = '@finance_cache_';

/**
 * Serviço de cache com AsyncStorage, TTL configurável e criptografia dos dados.
 * Melhora a performance evitando requisições repetidas ao Firestore (SRP).
 */
export class CacheService {
  /**
   * Persiste dados no cache com TTL (time-to-live) em segundos.
   * Os dados são criptografados antes de serem armazenados.
   * @param {string} key
   * @param {*} data
   * @param {number} ttlSeconds
   * @returns {Promise<void>}
   */
  async set(key, data, ttlSeconds) {
    try {
      const entry = {
        data,
        expiresAt: Date.now() + ttlSeconds * 1000,
      };
      const serialized = JSON.stringify(entry);
      const encrypted = EncryptionService.encrypt(serialized);
      await AsyncStorage.setItem(CACHE_PREFIX + key, encrypted);
    } catch (error) {
      // Cache não é crítico: falha silenciosa para não impedir o fluxo
      console.warn('[CacheService] Falha ao gravar cache:', error.message);
    }
  }

  /**
   * Recupera dados do cache se ainda estiverem dentro do TTL.
   * Retorna null se ausente, expirado ou corrompido.
   * @param {string} key
   * @returns {Promise<*|null>}
   */
  async get(key) {
    try {
      const encrypted = await AsyncStorage.getItem(CACHE_PREFIX + key);
      if (!encrypted) return null;

      const serialized = EncryptionService.decrypt(encrypted);
      const entry = JSON.parse(serialized);

      if (Date.now() > entry.expiresAt) {
        await this.invalidate(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.warn('[CacheService] Falha ao ler cache:', error.message);
      return null;
    }
  }

  /**
   * Remove uma entrada específica do cache.
   * @param {string} key
   * @returns {Promise<void>}
   */
  async invalidate(key) {
    try {
      await AsyncStorage.removeItem(CACHE_PREFIX + key);
    } catch (error) {
      console.warn('[CacheService] Falha ao invalidar cache:', error.message);
    }
  }

  /**
   * Limpa todo o cache da aplicação.
   * @returns {Promise<void>}
   */
  async clear() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.warn('[CacheService] Falha ao limpar cache:', error.message);
    }
  }
}
