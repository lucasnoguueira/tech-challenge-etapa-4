import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook customizado para consumir o AuthContext.
 * Encapsula o acesso ao contexto e evita imports diretos nas telas (DRY).
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider.');
  }
  return context;
};
