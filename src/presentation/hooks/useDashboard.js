import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getDashboardDataUseCase } from '../contexts/TransactionContext';

const EMPTY_LINE_DATA = {
  labels: ['--'],
  datasets: [{ data: [0], color: () => '#2A9D8F', strokeWidth: 2 }],
};

/**
 * Hook customizado para gerenciar os dados do Dashboard.
 * Encapsula busca, estado de loading e tratamento de erro (SRP, DRY).
 */
export const useDashboard = () => {
  const [balance, setBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [lineData, setLineData] = useState(EMPTY_LINE_DATA);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getDashboardDataUseCase.execute();
      setBalance(result.balance);
      setTotalIncome(result.totalIncome);
      setTotalExpenses(result.totalExpenses);
      setPieData(result.pieData);
      setLineData(result.lineData || EMPTY_LINE_DATA);
    } catch (err) {
      console.warn('[useDashboard] Erro ao carregar dashboard:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  return {
    balance,
    totalIncome,
    totalExpenses,
    lineData,
    pieData,
    loading,
    refreshing,
    onRefresh,
  };
};
