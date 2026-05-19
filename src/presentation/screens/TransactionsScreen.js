import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTransactions } from '../hooks/useTransactions';
import TransactionCard from '../components/business/TransactionCard';
import CategoryChip from '../components/business/CategoryChip';
import EmptyState from '../components/common/EmptyState';
import COLORS from '../../core/constants/colors';

/**
 * Tela de Extrato.
 * Responsabilidade única: composição de UI usando hook useTransactions (SRP).
 */
export default function TransactionsScreen({ navigation }) {
  const {
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
  } = useTransactions();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Extrato</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddTransaction')}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Atenção: Configuração Necessária</Text>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      )}

      <View style={styles.filterSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textLight} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar transação..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        <View style={styles.categoryFilterContainer}>
          <Text style={styles.filterLabel}>Categorias:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryListContent}
          >
            {categories.map((cat) => (
              <CategoryChip
                key={cat}
                label={cat}
                selected={selectedCategory === cat}
                onPress={() => setSelectedCategory(cat)}
              />
            ))}
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionCard
            item={item}
            onPress={() => navigation.navigate('AddTransaction', { transaction: item })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && !refreshing ? (
            <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 16 }} />
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState icon="wallet-outline" message="Nenhuma transação encontrada." />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  errorContainer: {
    padding: 10,
    backgroundColor: COLORS.errorBackground,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorTitle: {
    color: COLORS.error,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: COLORS.error,
    textAlign: 'center',
    fontSize: 12,
  },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: COLORS.textDark,
  },
  categoryFilterContainer: { marginTop: 8 },
  filterLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
    marginLeft: 4,
  },
  categoryListContent: {
    paddingRight: 20,
    paddingBottom: 4,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
