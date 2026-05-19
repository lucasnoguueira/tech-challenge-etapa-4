import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../../core/constants/colors';
import { formatCurrency } from '../../../core/utils/formatters';

/**
 * Card de saldo extraído do DashboardScreen (SRP, DRY).
 * Exibe saldo total, total de receitas e total de despesas.
 */
export default function BalanceCard({ balance, totalIncome, totalExpenses }) {
  const balanceColor = balance >= 0 ? COLORS.primary : COLORS.secondary;

  return (
    <View style={[styles.card, { borderLeftColor: balanceColor }]}>
      <Text style={styles.label}>SALDO ATUAL</Text>
      <Text style={[styles.balance, { color: balanceColor }]}>
        {formatCurrency(balance)}
      </Text>

      <View style={styles.row}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: COLORS.primary }]}>▲ Receitas</Text>
          <Text style={[styles.summaryValue, { color: COLORS.primary }]}>
            {formatCurrency(totalIncome)}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: COLORS.secondary }]}>▼ Despesas</Text>
          <Text style={[styles.summaryValue, { color: COLORS.secondary }]}>
            {formatCurrency(totalExpenses)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  label: {
    fontSize: 12,
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: -1,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.inputBorder,
    marginHorizontal: 8,
  },
});
