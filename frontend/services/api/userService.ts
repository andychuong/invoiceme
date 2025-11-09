import { httpClient } from '../httpClient';
import { UserProfile, UpdateUserProfileRequest } from '@/types';

class UserService {
  private readonly BASE_URL = '/users';

  async getCurrentUser(): Promise<UserProfile> {
    return httpClient.get<UserProfile>(`${this.BASE_URL}/me`);
  }

  async updateCurrentUser(data: UpdateUserProfileRequest): Promise<UserProfile> {
    return httpClient.put<UserProfile>(`${this.BASE_URL}/me`, data);
  }

  async getUser(userId: string): Promise<UserProfile> {
    return httpClient.get<UserProfile>(`${this.BASE_URL}/${userId}`);
  }
}

export const userService = new UserService();

