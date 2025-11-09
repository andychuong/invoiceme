import { httpClient } from './httpClient';
import { LoginRequest, AuthResponse } from '@/types';

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USERNAME_KEY = 'username';

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>('/auth/login', credentials);
    this.setToken(response.token);
    this.setUsername(credentials.username);
    return response;
  }

  logout(): void {
    this.clearToken();
    this.clearUsername();
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

  getUsername(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.USERNAME_KEY);
  }

  setUsername(username: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USERNAME_KEY, username);
    }
  }

  clearUsername(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.USERNAME_KEY);
    }
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}

export const authService = new AuthService();

