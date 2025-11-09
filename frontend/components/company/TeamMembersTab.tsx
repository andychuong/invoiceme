'use client';

import {
  Box,
  Card,
  Text,
  VStack,
  Badge,
  IconButton,
} from '@chakra-ui/react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { CompanyMember } from '@/types';
import { authService } from '@/services/authService';
import { companyService } from '@/services/api/companyService';

interface TeamMembersTabProps {
  members: CompanyMember[];
  onMemberRemoved: (userId: string) => void;
}

export function TeamMembersTab({ members, onMemberRemoved }: TeamMembersTabProps) {
  const handleRemoveMember = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to remove ${username} from the company?`)) {
      return;
    }

    try {
      const companyId = authService.getCompanyId();
      if (!companyId) return;

      await companyService.removeMember(companyId, userId);
      onMemberRemoved(userId);
      toast.success(`${username} has been removed`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove member');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'red';
      case 'ACCOUNTANT':
        return 'blue';
      case 'OPERATOR':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <Card.Root>
      <Card.Body>
        <VStack align="stretch" gap={4}>
          <Box>
            <Text fontSize="lg" fontWeight="semibold">
              Team Members ({members.length})
            </Text>
            <Text color="gray.600" fontSize="sm">
              View all team members in your company
            </Text>
          </Box>

          <Box overflowX="auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #E2E8F0' }}>
                    <Text fontWeight="semibold">User</Text>
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #E2E8F0' }}>
                    <Text fontWeight="semibold">Email</Text>
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #E2E8F0' }}>
                    <Text fontWeight="semibold">Role</Text>
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #E2E8F0' }}>
                    <Text fontWeight="semibold">Joined</Text>
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #E2E8F0' }}>
                    <Text fontWeight="semibold">Actions</Text>
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr 
                    key={member.id} 
                    style={{ transition: 'background 0.2s' }} 
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F7FAFC'} 
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px', borderBottom: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {member.profilePictureUrl ? (
                          <img
                            src={member.profilePictureUrl}
                            alt={member.displayName || member.username}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: '#3182CE',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '600',
                              fontSize: '14px'
                            }}
                          >
                            {(member.displayName || member.username).charAt(0).toUpperCase()}
                          </div>
                        )}
                        <Box>
                          <Text fontWeight="medium">
                            {member.displayName || member.username}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            @{member.username}
                          </Text>
                        </Box>
                      </div>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #E2E8F0' }}>
                      <Text>{member.email}</Text>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #E2E8F0' }}>
                      <Badge colorPalette={getRoleBadgeColor(member.role)}>
                        {member.role}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #E2E8F0' }}>
                      <Text>{new Date(member.joinedAt).toLocaleDateString()}</Text>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #E2E8F0' }}>
                      {member.userId !== authService.getUserData()?.userId && (
                        <IconButton
                          aria-label="Remove member"
                          size="sm"
                          variant="ghost"
                          colorPalette="red"
                          onClick={() => handleRemoveMember(member.userId, member.username)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

