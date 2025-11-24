// hooks/useAuth.ts
// Hook central de autenticação: carrega usuário atual e expõe o serviço de autenticação.
// Mantemos este hook como única fonte de verdade para evitar duplicidades.
import { useState, useEffect } from 'react';
import { AutenticacaoService } from '../services/autenticacao';
import { User } from '../services/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        // isAuthenticated deve checar token/validade localmente (AsyncStorage) ou via backend
        const isAuthenticated = await AutenticacaoService.isAuthenticated();
        if (isAuthenticated) {
          const currentUser = await AutenticacaoService.me();
          if (mounted) setUser(currentUser);
        } else {
          if (mounted) setUser(null);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário no useAuth:', error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadUser();
    return () => { mounted = false; };
  }, []);

  // user, um flag de loading e o serviço pra quem quiser chamar ações (login/logout).
  return { user, isLoading, AutenticacaoService, setUser };
}
