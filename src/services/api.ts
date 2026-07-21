import type {
  IApiResponse,
  IAppointment,
  IAvailabilityResponse,
  ICreateAppointmentRequest,
  IDashboardData,
  ILoginRequest,
  ILoginResponse,
  ILookupAppointmentRequest,
  INextAvailableSlot,
  IPaginatedResponse,
  IService,
} from "@/types";
import axios from "axios";
import type { AxiosInstance } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333/api";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Interceptor para adicionar token nas requisições
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // ============================================
  // AUTENTICAÇÃO
  // ============================================

  async login(data: ILoginRequest): Promise<ILoginResponse> {
    const response = await this.api.post<IApiResponse<ILoginResponse>>("/auth/login", data);
    return response.data.data ?? ({} as ILoginResponse);
  }

  async getMe(): Promise<IApiResponse<{ id: string; name: string; email: string }>> {
    const response = await this.api.get("/auth/me");
    return response.data;
  }

  // ============================================
  // SERVIÇOS
  // ============================================

  async getServices(onlyActive = true): Promise<IService[]> {
    const response = await this.api.get<IApiResponse<IService[]>>("/services", {
      params: { active: onlyActive },
    });
    return response.data.data || [];
  }

  async getServiceById(id: string): Promise<IService> {
    const response = await this.api.get<IApiResponse<IService>>(`/services/${id}`);
    return response.data.data ?? ({} as IService);
  }

  async createService(data: Partial<IService>): Promise<IService> {
    const response = await this.api.post<IApiResponse<IService>>("/services", data);
    return response.data.data ?? ({} as IService);
  }

  async updateService(id: string, data: Partial<IService>): Promise<IService> {
    const response = await this.api.patch<IApiResponse<IService>>(`/services/${id}`, data);
    return response.data.data ?? ({} as IService);
  }

  async toggleServiceStatus(id: string): Promise<IService> {
    const response = await this.api.patch<IApiResponse<IService>>(`/services/${id}/toggle`);
    return response.data.data ?? ({} as IService);
  }

  async deleteService(id: string): Promise<void> {
    await this.api.delete(`/services/${id}`);
  }

  // ============================================
  // AGENDAMENTOS PÚBLICOS
  // ============================================

  async createAppointment(data: ICreateAppointmentRequest): Promise<IApiResponse<IAppointment>> {
    // data.appointmentDate já vem como "yyyy-MM-dd" (sem componente de horário).
    // Enviar direto, sem reprocessar via `new Date(...)`: strings de data
    // "YYYY-MM-DD" são interpretadas como UTC meia-noite pelo JS, e qualquer
    // conversão usando getters locais (getFullYear/getMonth/getDate/getHours)
    // sobre esse instante pode devolver o dia anterior em timezones atrás do
    // UTC (ex: Brasil), deslocando a data enviada ao backend.
    const response = await this.api.post<IApiResponse<IAppointment>>("/appointments", data);
    return response.data;
  }

  async lookupAppointment(data: ILookupAppointmentRequest): Promise<IAppointment> {
    const response = await this.api.post<IApiResponse<IAppointment>>("/appointments/lookup", data);
    if (!response.data.data) {
      throw new Error("Agendamento não encontrado");
    }
    return response.data.data;
  }

  async getAvailability(date: string, serviceId: string): Promise<IAvailabilityResponse> {
    const response = await this.api.get<IApiResponse<IAvailabilityResponse>>("/availability", {
      params: { date, serviceId },
    });
    return response.data.data ?? ({} as IAvailabilityResponse);
  }

  async getNextAvailableSlot(): Promise<INextAvailableSlot> {
    const response = await this.api.get<IApiResponse<INextAvailableSlot>>("/next-available-slot");
    return response.data.data ?? ({} as INextAvailableSlot);
  }

  // ============================================
  // AGENDAMENTOS ADMINISTRATIVOS
  // ============================================

  async getAppointments(filters?: {
    date?: string;
    status?: string;
    serviceId?: string;
    customerName?: string;
    customerPhone?: string;
    limit?: number;
    offset?: number;
  }): Promise<IPaginatedResponse<IAppointment>> {
    const response = await this.api.get<IApiResponse<IPaginatedResponse<IAppointment>>>(
      "/appointments",
      { params: filters },
    );
    return response.data.data ?? ({} as IPaginatedResponse<IAppointment>);
  }

  async getAppointmentById(id: string): Promise<IAppointment> {
    const response = await this.api.get<IApiResponse<IAppointment>>(`/appointments/${id}`);
    return response.data.data ?? ({} as IAppointment);
  }

  async updateAppointmentStatus(id: string, status: string): Promise<IAppointment> {
    const response = await this.api.patch<IApiResponse<IAppointment>>(
      `/appointments/${id}/status`,
      { status },
    );
    return response.data.data ?? ({} as IAppointment);
  }

  async cancelAppointment(id: string): Promise<IAppointment> {
    const response = await this.api.patch<IApiResponse<IAppointment>>(`/appointments/${id}/cancel`);
    return response.data.data ?? ({} as IAppointment);
  }

  async deleteAppointment(id: string): Promise<void> {
    await this.api.delete(`/appointments/${id}`);
  }

  // ============================================
  // DASHBOARD
  // ============================================

  async getDashboard(): Promise<IDashboardData> {
    const response = await this.api.get<IApiResponse<IDashboardData>>("/admin/dashboard");
    return response.data.data ?? ({} as IDashboardData);
  }
}

export const apiService = new ApiService();
