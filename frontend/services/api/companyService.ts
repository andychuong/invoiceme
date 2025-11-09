import { httpClient } from '../httpClient';
import { Company, UpdateCompanyRequest, CompanyMember, InviteUserRequest } from '@/types';

class CompanyService {
  private readonly BASE_URL = '/companies';

  async getCompany(companyId: string): Promise<Company> {
    return httpClient.get<Company>(`${this.BASE_URL}/${companyId}`);
  }

  async updateCompany(companyId: string, data: UpdateCompanyRequest): Promise<Company> {
    return httpClient.put<Company>(`${this.BASE_URL}/${companyId}`, data);
  }

  async getCompanyMembers(companyId: string): Promise<CompanyMember[]> {
    return httpClient.get<CompanyMember[]>(`${this.BASE_URL}/${companyId}/members`);
  }

  async inviteUser(companyId: string, data: InviteUserRequest): Promise<CompanyMember> {
    return httpClient.post<CompanyMember>(`${this.BASE_URL}/${companyId}/invite`, data);
  }

  async removeMember(companyId: string, userId: string): Promise<void> {
    return httpClient.delete(`${this.BASE_URL}/${companyId}/members/${userId}`);
  }

  async regenerateCompanyCode(companyId: string): Promise<Company> {
    return httpClient.post<Company>(`${this.BASE_URL}/${companyId}/regenerate-code`, {});
  }
}

export const companyService = new CompanyService();

