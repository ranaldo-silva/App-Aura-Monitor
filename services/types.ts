// services/types.ts

// ========================
// USUÁRIOS
// ========================
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  dataCadastro: string;
}

export interface UsuarioCreate {
  nome: string;
  email: string;
  senha: string;
  dataCadastro: string; // Formato esperado: YYYY-MM-DD
}

// ========================
// LOGIN (Autenticação)
// ========================
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
    dataCadastro: string;
  };
  // Se este objeto existir, o usuário é um GESTOR (Admin/RH)
  gestor?: { 
    id: number;
    nome: string;
    email: string;
    usuarioId: number;
  } | null;
}

// ========================
// CHECK-IN HUMOR
// ========================
export interface CheckinHumorRequest {
  dataCheckin: string; // yyyy-MM-dd
  nivelHumor: number;  // Inteiro: 1 a 10
  comentario?: string | null;
  usuarioId: number;
}

export interface CheckinHumorResponse {
  id: number;
  dataCheckin: string;
  nivelHumor: number;
  comentario?: string;
  usuarioId: number;
}

// facilitar leitura em componentes como o RH
export type MoodEntry = CheckinHumorResponse; 

// ========================
// IOT
// ========================
export interface DadosIot {
  id: number;
  dataColeta: string;
  temperatura: string;
  localSensor: string;
  checkinId: number;
}

export interface DadosIotCreate {
  dataColeta: string;
  temperatura: string;
  localSensor: string;
  checkinId: number;
}

// ========================
// TIPOS AUXILIARES (Uso interno do App)
// ========================

// Usado no MoodSelector.tsx
export type MoodLevel = 'muito_feliz' | 'feliz' | 'neutro' | 'estressado' | 'muito_estressado';

// Usado no useAuth e Header
export interface User {
  id: number;
  nome: string;
  full_name: string;
  email: string;
  tipo: 'ADMIN' | 'EMPLOYEE';
  role: 'admin' | 'colaborador';
  mood_status: 'feliz' | 'neutro' | 'estressado';
}

// Usado no ScheduleCard (se ainda estiver no projeto)
export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  event_type: 'work' | 'meeting' | 'break' | 'active_pause' | 'focus_time';
  is_completed: boolean;
}