import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../../core/constants/colors';

/**
 * Componente de estado vazio reutilizável (DRY).
 * Exibido quando uma lista não possui itens.
 */
export default function EmptyState({
  icon = 'wallet-outline',
  message = 'Nenhum item encontrado.',
}) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={52} color={COLORS.textLight} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    opacity: 0.5,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});
