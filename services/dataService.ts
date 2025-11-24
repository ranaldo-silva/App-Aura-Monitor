// services/dataService.ts
import { api } from "./api";
import {
  Usuario,
  UsuarioCreate,
  CheckinHumorRequest,
  CheckinHumorResponse,
  DadosIot,
  DadosIotCreate
} from "./types";

const ENDPOINTS = {
  USERS_ALL: "/api/usuarios/all", 
  USERS: "/api/usuarios",
  CHECKINS: "/api/checkins",
  IOT: "/api/dados-iot" 
};

export const DataService = {
  /* =========================================================
   * USUÁRIOS
   * ========================================================= */
  async getAllUsers() {
    const resp = await api.get(ENDPOINTS.USERS_ALL);
    return resp.data;
  },

  async getUserById(id: number): Promise<Usuario> {
    const resp = await api.get(`${ENDPOINTS.USERS}/${id}`);
    return resp.data;
  },

  async createUser(data: UsuarioCreate): Promise<Usuario> {
    const resp = await api.post(ENDPOINTS.USERS, data);
    return resp.data;
  },

  async updateUsuario(id: number, data: Partial<UsuarioCreate>): Promise<Usuario> {
    const resp = await api.put(`${ENDPOINTS.USERS}/${id}`, data);
    return resp.data;
  },

  async updateUser(id: number, data: Partial<UsuarioCreate>): Promise<Usuario> {
    return this.updateUsuario(id, data);
  },

  async registerUsuario(data: any) {
    return this.createUser(data);
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`${ENDPOINTS.USERS}/${id}`);
  },

  /* =========================================================
   * CHECK-INS
   * ========================================================= */
  async getAllCheckins(): Promise<CheckinHumorResponse[]> {
     const resp = await api.get(ENDPOINTS.CHECKINS);
     return resp.data;
  },

  async getCheckins(): Promise<CheckinHumorResponse[]> {
    return this.getAllCheckins();
  },

  async getCheckinById(id: number): Promise<CheckinHumorResponse> {
    const resp = await api.get(`${ENDPOINTS.CHECKINS}/${id}`);
    return resp.data;
  },

  async getCheckinsByUser(usuarioId: number): Promise<CheckinHumorResponse[]> {
    const resp = await api.get(`${ENDPOINTS.CHECKINS}/usuario/${usuarioId}`);
    return resp.data;
  },

  async createCheckin(data: CheckinHumorRequest): Promise<CheckinHumorResponse> {
    const resp = await api.post(ENDPOINTS.CHECKINS, data);
    return resp.data;
  },

  /* =========================================================
   * IOT 
   * ========================================================= */
  async getIoT(): Promise<DadosIot[]> {
    const resp = await api.get(ENDPOINTS.IOT);
    return resp.data;
  },

  async createIoT(data: DadosIotCreate): Promise<DadosIot> {
    const resp = await api.post(ENDPOINTS.IOT, data);
    return resp.data;
  }
};