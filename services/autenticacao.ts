// services/autenticacao.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";
import { LoginRequest, LoginResponse } from "./types";

export type TipoUsuario = "ADMIN" | "EMPLOYEE";

interface UsuarioApp {
  id: number;
  nome: string;
  full_name: string;
  email: string;
  tipo: TipoUsuario;
  role: 'admin' | 'colaborador';
  mood_status: 'feliz' | 'neutro' | 'estressado';
}

export const AutenticacaoService = {

  async loginWithCredentials(emailInput: string, senhaInput: string, isRh: boolean): Promise<TipoUsuario> {
    try {
      const endpoint = isRh ? '/api/gestores/login' : '/api/usuarios/login';
      console.log(`[AUTH] Iniciando login em: ${endpoint}`);

      const payload: LoginRequest = {
        email: emailInput.trim(),
        senha: senhaInput.trim()
      };

      const response = await api.post(endpoint, payload);
      const data = response.data as LoginResponse;

      console.log("[AUTH] Resposta JSON:", JSON.stringify(data));

      // 1. VALIDA SUCESSO
      if (data.success === false) {
        throw new Error(data.message || "Credenciais inválidas.");
      }

      // Tenta pegar dados do 'usuario'. Se não tiver, tenta pegar do 'gestor'.
      const dadosCadastrais = data.usuario || data.gestor;

      if (!dadosCadastrais) {
        throw new Error("Erro Crítico: A API retornou sucesso, mas não enviou dados de perfil (usuario ou gestor).");
      }

      // 3. DEFINE O TIPO
      const tipo: TipoUsuario = isRh ? "ADMIN" : "EMPLOYEE";
      const role: 'admin' | 'colaborador' = isRh ? "admin" : "colaborador";

      // 4. MONTA SESSÃO
      const usuarioSessao: UsuarioApp = {
        id: dadosCadastrais.id, // Usa o ID do usuário ou do gestor
        nome: dadosCadastrais.nome,
        full_name: dadosCadastrais.nome,
        email: dadosCadastrais.email,
        tipo: tipo,
        role: role,
        mood_status: 'neutro'
      };

      await AsyncStorage.setItem("@TOKEN", "sessao_ativa");
      await AsyncStorage.setItem("@USER", JSON.stringify(usuarioSessao));

      return tipo;

    } catch (error: any) {
      console.error("[AUTH] Erro:", error);

      if (error.response) {
        const s = error.response.status;
        if (s === 401 || s === 403) throw new Error("E-mail ou senha incorretos.");
        if (s === 404) throw new Error(`Endpoint não encontrado: ${isRh ? '/api/gestores/login' : '/api/usuarios/login'}`);
      }
      
      if (error.message) throw error;
      throw new Error("Falha na conexão.");
    }
  },

  async isAuthenticated() {
    const token = await AsyncStorage.getItem("@TOKEN");
    return !!token;
  },
  async me() {
    const data = await AsyncStorage.getItem("@USER");
    return data ? JSON.parse(data) : null;
  },
  async getToken() {
    return await AsyncStorage.getItem("@TOKEN");
  },
  async logout() {
    await AsyncStorage.removeItem("@USER");
    await AsyncStorage.removeItem("@TOKEN");
  }
};