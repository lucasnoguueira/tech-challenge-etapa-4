import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ALL_CATEGORIES_LABEL } from '../../core/constants/categories';
import { getTransactionsUseCase } from '../contexts/TransactionContext';

/**
 * Hook customizado para gerenciar a lista de transações com filtros,
 * paginação e refresh (SRP, DRY).
 */
export const useTransactions = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [categories, setCategories] = useState([ALL_CATEGORIES_LABEL]);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES_LABEL);
  const [searchText, setSearchText] = useState('');
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Aplica filtros localmente sempre que dados ou filtros mudam (programação reativa)
  useEffect(() => {
    let result = allTransactions;

    if (selectedCategory !== ALL_CATEGORIES_LABEL) {
      result = result.filter((t) => t.category === selectedCategory);
    }

    if (searchText.trim()) {
      const lower = searchText.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(lower) ||
          t.category.toLowerCase().includes(lower),
      );
    }

    setFilteredTransactions(result);
  }, [searchText, selectedCategory, allTransactions]);

  const loadTransactions = useCallback(async (reset = false) => {
    if (loading && !reset) return;
    setLoading(true);
    setError(null);

    try {
      const cursor = reset ? null : lastVisible;
      const { data, lastVisible: newLastVisible } = await getTransactionsUseCase.execute(cursor);

      const newData = reset ? data : [...allTransactions, ...data];
      setAllTransactions(newData);
      setLastVisible(newLastVisible);

      const uniqueCategories = [ALL_CATEGORIES_LABEL, ...new Set(newData.map((t) => t.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      setError('Erro ao carregar dados. Verifique o índice no Firebase.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading, lastVisible, allTransactions]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTransactions(true);
  }, [loadTransactions]);

  const loadMore = useCallback(() => {
    if (lastVisible && !searchText && selectedCategory === ALL_CATEGORIES_LABEL) {
      loadTransactions(false);
    }
  }, [lastVisible, searchText, selectedCategory, loadTransactions]);

  useFocusEffect(
    useCallback(() => {
      loadTransactions(true);
    }, []),
  );

  return {
    filteredTransactions,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchText,
    setSearchText,
    loading,
    refreshing,
    error,
    onRefresh,
    loadMore,
  };
};
