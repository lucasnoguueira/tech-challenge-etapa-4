import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../../core/constants/colors';
import { formatCurrency, formatDate } from '../../../core/utils/formatters';

/**
 * Card de transação individual.
 * Extraído da TransactionsScreen para seguir SRP e ser reutilizável.
 */
export default function TransactionCard({ item, onPress }) {
  const isExpense = item.amount < 0;
  const iconBg = isExpense
    ? 'rgba(231, 111, 81, 0.1)'
    : 'rgba(42, 157, 143, 0.1)';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
            <Ionicons
              name={isExpense ? 'arrow-down' : 'arrow-up'}
              size={20}
              color={isExpense ? COLORS.secondary : COLORS.primary}
            />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>

        <View style={styles.right}>
          <Text style={[styles.amount, { color: isExpense ? COLORS.secondary : COLORS.primary }]}>
            {isExpense ? '- ' : '+ '}
            {formatCurrency(Math.abs(item.amount))}
          </Text>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  iconContainer: { marginRight: 16 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { flex: 1 },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  category: { fontSize: 12, color: COLORS.textLight },
  right: { alignItems: 'flex-end' },
  amount: { fontSize: 16, fontWeight: '700' },
  date: { color: COLORS.textLight, fontSize: 12, marginTop: 4 },
});
