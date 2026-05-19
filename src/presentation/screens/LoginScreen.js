import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import COLORS from '../../core/constants/colors';

/**
 * Tela de Login e Cadastro.
 * Responsabilidade única: composição de UI e delegação ao hook useAuth (SRP).
 */
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  const { signIn, register } = useAuth();

  const handleAuth = async () => {
    setLoadingAction(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await register(email, password, confirmPassword);
      }
    } catch (error) {
      Alert.alert('Erro de Autenticação', error.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="wallet-outline" size={64} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Finance App</Text>
          <Text style={styles.subtitle}>Gerencie suas finanças com facilidade</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
          </Text>

          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="E-mail"
            iconName="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Senha"
            iconName="lock-closed-outline"
            secureTextEntry
          />

          {!isLogin && (
            <Input
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirmar Senha"
              iconName="lock-closed-outline"
              secureTextEntry
            />
          )}

          <Button
            title={isLogin ? 'Entrar' : 'Cadastrar'}
            onPress={handleAuth}
            loading={loadingAction}
            style={styles.button}
          />

          <Button
            title={isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
            onPress={toggleMode}
            variant="outline"
            style={styles.switchButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
  },
  switchButton: {
    marginTop: 12,
  },
});
