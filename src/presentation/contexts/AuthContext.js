import React, { createContext, useState, useEffect, useMemo } from 'react';
import { FirebaseAuthDataSource } from '../../data/datasources/FirebaseAuthDataSource';
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl';
import { SignInUseCase } from '../../domain/usecases/auth/SignInUseCase';
import { RegisterUseCase } from '../../domain/usecases/auth/RegisterUseCase';
import { SignOutUseCase } from '../../domain/usecases/auth/SignOutUseCase';

// Composição das dependências (Dependency Injection manual)
const authDataSource = new FirebaseAuthDataSource();
const authRepository = new AuthRepositoryImpl(authDataSource);
const signInUseCase = new SignInUseCase(authRepository);
const registerUseCase = new RegisterUseCase(authRepository);
const signOutUseCase = new SignOutUseCase(authRepository);

export const AuthContext = createContext({});

/**
 * Provider de autenticação.
 * Gerencia o estado do usuário e expõe os use cases via context (SRP).
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authRepository.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // useMemo garante que o objeto de contexto não seja recriado a cada render (performance)
  const contextValue = useMemo(
    () => ({
      user,
      loading,
      signIn: (email, password) => signInUseCase.execute(email, password),
      register: (email, password, confirmPassword) =>
        registerUseCase.execute(email, password, confirmPassword),
      logout: () => signOutUseCase.execute(),
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
