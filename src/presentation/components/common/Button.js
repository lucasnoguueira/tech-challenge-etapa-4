import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import COLORS from '../../../core/constants/colors';

/**
 * Componente de botão reutilizável.
 * Suporta variantes: primary, secondary, outline (OCP, DRY).
 */
export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
}) {
  const buttonStyle = [
    styles.base,
    styles[variant],
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyle = [styles.text, styles[`${variant}Text`]];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? COLORS.primary : '#FFF'} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primary: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    shadowColor: COLORS.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    elevation: 0,
    shadowOpacity: 0,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  primaryText: { color: '#FFFFFF' },
  secondaryText: { color: '#FFFFFF' },
  outlineText: { color: COLORS.primary },
});
