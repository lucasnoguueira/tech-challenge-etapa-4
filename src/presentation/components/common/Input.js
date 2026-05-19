import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../../core/constants/colors';

/**
 * Componente de input reutilizável com suporte a ícone (DRY).
 */
export default function Input({
  value,
  onChangeText,
  placeholder,
  iconName,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  style,
  inputStyle,
}) {
  return (
    <View style={[styles.container, style]}>
      {iconName && (
        <Ionicons
          name={iconName}
          size={20}
          color={COLORS.textLight}
          style={styles.icon}
        />
      )}
      <TextInput
        style={[styles.input, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.textDark,
  },
});
