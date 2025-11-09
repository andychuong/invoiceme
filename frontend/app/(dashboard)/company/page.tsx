'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Flex,
  Heading,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { authService } from '@/services/authService';
import { companyService } from '@/services/api/companyService';
import { toast } from 'sonner';
import { Company, CompanyMember } from '@/types';
import { CompanyProfileTab } from '@/components/company/CompanyProfileTab';
import { TeamMembersTab } from '@/components/company/TeamMembersTab';

export default function CompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);
  const [members, setMembers] = useState<CompanyMember[]>([]);

  useEffect(() => {
    // Check if user is admin
    if (!authService.isAdmin()) {
      router.push('/customers');
      return;
    }

    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const companyId = authService.getCompanyId();
      if (!companyId) {
        toast.error('No company found');
        return;
      }

      const [companyData, membersData] = await Promise.all([
        companyService.getCompany(companyId),
        companyService.getCompanyMembers(companyId),
      ]);

      setCompany(companyData);
      setMembers(membersData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load company data');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyUpdate = (updatedCompany: Company) => {
    setCompany(updatedCompany);
  };

  const handleMemberRemoved = (userId: string) => {
    setMembers(members.filter(m => m.userId !== userId));
  };

  if (loading) {
    return (
      <Container maxW="7xl">
        <Text>Loading...</Text>
      </Container>
    );
  }

  if (!company) {
    return (
      <Container maxW="7xl">
        <Text>Company not found</Text>
      </Container>
    );
  }

  return (
    <Container maxW="7xl">
      <VStack align="stretch" gap={6}>
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="lg" mb={2}>Company Settings</Heading>
            <Text color="gray.600">Manage your company profile and team members</Text>
          </Box>
        </Flex>

        <Tabs.Root defaultValue="profile" colorPalette="blue">
          <Tabs.List>
            <Tabs.Trigger value="profile">
              Company Profile
            </Tabs.Trigger>
            <Tabs.Trigger value="members">
              Team Members
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="profile">
            <CompanyProfileTab 
              company={company} 
              onUpdate={handleCompanyUpdate} 
            />
          </Tabs.Content>

          <Tabs.Content value="members">
            <TeamMembersTab 
              members={members} 
              onMemberRemoved={handleMemberRemoved} 
            />
          </Tabs.Content>
        </Tabs.Root>
      </VStack>
    </Container>
  );
}
