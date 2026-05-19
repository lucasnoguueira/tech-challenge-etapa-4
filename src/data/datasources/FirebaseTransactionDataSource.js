import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db, auth } from '../../config/firebaseConfig';
import { TransactionModel } from '../models/TransactionModel';
import { AuthError, NetworkError } from '../../core/errors/AppError';

const COLLECTION = 'transactions';

/**
 * Fonte de dados: acesso direto ao Firestore para transações.
 * Toda a lógica Firebase está isolada aqui (SRP).
 */
export class FirebaseTransactionDataSource {
  _requireAuth() {
    const user = auth.currentUser;
    if (!user) throw new AuthError('Usuário não autenticado.');
    return user;
  }

  /**
   * @param {object} data
   * @returns {Promise<string>} ID do documento criado
   */
  async add(data) {
    try {
      const user = this._requireAuth();
      const docRef = await addDoc(collection(db, COLLECTION), {
        ...TransactionModel.toFirestore(data),
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      throw new NetworkError(`Erro ao adicionar transação: ${error.message}`);
    }
  }

  /**
   * @param {string} id
   * @param {object} data
   * @returns {Promise<void>}
   */
  async update(id, data) {
    try {
      const transactionRef = doc(db, COLLECTION, id);
      await updateDoc(transactionRef, TransactionModel.toFirestore(data));
    } catch (error) {
      throw new NetworkError(`Erro ao atualizar transação: ${error.message}`);
    }
  }

  /**
   * Busca uma página de transações (paginação por cursor).
   * @param {object|null} lastVisible
   * @returns {Promise<{ data: object[], lastVisible: object|null }>}
   */
  async getPage(lastVisible = null) {
    try {
      const user = this._requireAuth();

      let q = query(
        collection(db, COLLECTION),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(10),
      );

      if (lastVisible) {
        q = query(
          collection(db, COLLECTION),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(10),
          startAfter(lastVisible),
        );
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => TransactionModel.fromFirestore(d.id, d.data()));

      return {
        data,
        lastVisible: snapshot.docs[snapshot.docs.length - 1] || null,
      };
    } catch (error) {
      throw new NetworkError(`Erro ao buscar transações: ${error.message}`);
    }
  }

  /**
   * Busca todas as transações ordenadas por data (para o dashboard).
   * @returns {Promise<object[]>}
   */
  async getAll() {
    try {
      const user = this._requireAuth();

      const q = query(
        collection(db, COLLECTION),
        where('userId', '==', user.uid),
        orderBy('date', 'asc'),
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => TransactionModel.fromFirestore(d.id, d.data()));
    } catch (error) {
      throw new NetworkError(`Erro ao buscar todas as transações: ${error.message}`);
    }
  }
}
