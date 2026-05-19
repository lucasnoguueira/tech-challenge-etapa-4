import React, { createContext, useState, useCallback, useMemo } from 'react';
import { FirebaseTransactionDataSource } from '../../data/datasources/FirebaseTransactionDataSource';
import { TransactionRepositoryImpl } from '../../data/repositories/TransactionRepositoryImpl';
import { CacheService } from '../../infrastructure/cache/CacheService';
import { GetTransactionsUseCase } from '../../domain/usecases/transaction/GetTransactionsUseCase';
import { AddTransactionUseCase } from '../../domain/usecases/transaction/AddTransactionUseCase';
import { UpdateTransactionUseCase } from '../../domain/usecases/transaction/UpdateTransactionUseCase';
import { GetDashboardDataUseCase } from '../../domain/usecases/transaction/GetDashboardDataUseCase';

// Composição das dependências (Dependency Injection manual)
const cacheService = new CacheService();
const dataSource = new FirebaseTransactionDataSource();
const transactionRepository = new TransactionRepositoryImpl(dataSource, cacheService);

export const getTransactionsUseCase = new GetTransactionsUseCase(transactionRepository);
export const addTransactionUseCase = new AddTransactionUseCase(transactionRepository);
export const updateTransactionUseCase = new UpdateTransactionUseCase(transactionRepository);
export const getDashboardDataUseCase = new GetDashboardDataUseCase(transactionRepository);

export const TransactionContext = createContext({});

/**
 * Provider de transações.
 * Expõe os use cases e estado global de transações para os hooks consumirem (SRP).
 */
export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);

  const refreshTransactions = useCallback(async () => {
    const { data, lastVisible: lv } = await getTransactionsUseCase.execute(null);
    setTransactions(data);
    setLastVisible(lv);
  }, []);

  const loadMoreTransactions = useCallback(async () => {
    if (!lastVisible) return;
    const { data, lastVisible: lv } = await getTransactionsUseCase.execute(lastVisible);
    setTransactions((prev) => [...prev, ...data]);
    setLastVisible(lv);
  }, [lastVisible]);

  const contextValue = useMemo(
    () => ({
      transactions,
      lastVisible,
      refreshTransactions,
      loadMoreTransactions,
    }),
    [transactions, lastVisible, refreshTransactions, loadMoreTransactions],
  );

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};
