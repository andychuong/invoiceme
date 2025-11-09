import { httpClient } from './httpClient';
import { LoginRequest, AuthResponse } from '@/types';

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_DATA_KEY = 'user_data';

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>('/auth/login', credentials);
    this.setToken(response.token);
    this.setUserData(response);
    return response;
  }

  logout(): void {
    this.clearToken();
    this.clearUserData();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  getUserData(): AuthResponse | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(this.USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  }

  setUserData(userData: AuthResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
    }
  }

  clearUserData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.USER_DATA_KEY);
    }
  }

  // Backwards compatibility
  getUsername(): string | null {
    const userData = this.getUserData();
    return userData?.username || null;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  isAdmin(): boolean {
    const userData = this.getUserData();
    return userData?.role === 'ADMIN';
  }

  getCompanyId(): string | null {
    const userData = this.getUserData();
    return userData?.companyId || null;
  }

  getCompanyName(): string | null {
    const userData = this.getUserData();
    return userData?.companyName || null;
  }

  getCompanyLogoUrl(): string | null {
    const userData = this.getUserData();
    return userData?.companyLogoUrl || null;
  }
}

export const authService = new AuthService();

