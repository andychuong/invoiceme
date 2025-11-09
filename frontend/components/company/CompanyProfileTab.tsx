'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Flex,
  Input,
  Text,
  VStack,
  HStack,
  Field,
} from '@chakra-ui/react';
import { toast } from 'sonner';
import { Company, UpdateCompanyRequest } from '@/types';
import { authService } from '@/services/authService';
import { companyService } from '@/services/api/companyService';
import Image from 'next/image';

interface CompanyProfileTabProps {
  company: Company;
  onUpdate: (company: Company) => void;
}

export function CompanyProfileTab({ company, onUpdate }: CompanyProfileTabProps) {
  const [companyForm, setCompanyForm] = useState<UpdateCompanyRequest>({
    name: company.name,
    logoUrl: company.logoUrl || '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const companyId = authService.getCompanyId();
      if (!companyId) return;

      const updated = await companyService.updateCompany(companyId, companyForm);
      onUpdate(updated);

      // Update local storage
      const userData = authService.getUserData();
      if (userData) {
        authService.setUserData({
          ...userData,
          companyName: updated.name,
          companyLogoUrl: updated.logoUrl,
        });
      }

      toast.success('Company settings updated');
      
      // Reload to reflect changes in header
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update company');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyCompanyCode = () => {
    if (company?.companyCode) {
      navigator.clipboard.writeText(company.companyCode);
      setCopied(true);
      toast.success('Company code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerateCode = async () => {
    if (!confirm('Are you sure you want to regenerate the company code? The old code will no longer work for new members joining.')) {
      return;
    }

    try {
      const companyId = authService.getCompanyId();
      if (!companyId) return;

      const updated = await companyService.regenerateCompanyCode(companyId);
      onUpdate(updated);
      toast.success('Company code regenerated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to regenerate company code');
    }
  };

  return (
    <Card.Root>
      <Card.Body>
        <form onSubmit={handleUpdateCompany}>
          <VStack align="stretch" gap={4}>
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                White Label Settings
              </Text>
              <Text color="gray.600" mb={4}>
                Customize your company branding. Changes will be reflected across the entire application.
              </Text>
            </Box>

            <Field.Root required>
              <Field.Label>Company Name</Field.Label>
              <Input
                value={companyForm.name}
                onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                placeholder="Your Company Name"
              />
            </Field.Root>

            {/* Company Code Display */}
            <Box
              p={4}
              bg="blue.50"
              borderRadius="md"
              borderWidth="1px"
              borderColor="blue.200"
            >
              <VStack align="stretch" gap={2}>
                <Text fontSize="sm" fontWeight="semibold" color="blue.900">
                  Company Code
                </Text>
                <Text fontSize="xs" color="blue.700" mb={2}>
                  Share this code with employees to invite them to join your company
                </Text>
                <HStack>
                  <Input
                    value={company?.companyCode || ''}
                    readOnly
                    bg="white"
                    fontFamily="mono"
                    fontSize="sm"
                  />
                  <Button
                    onClick={handleCopyCompanyCode}
                    colorScheme="blue"
                    size="md"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button
                    onClick={handleRegenerateCode}
                    colorScheme="orange"
                    size="md"
                  >
                    Regenerate
                  </Button>
                </HStack>
              </VStack>
            </Box>

            <Field.Root>
              <Field.Label>Company Logo URL</Field.Label>
              <Input
                value={companyForm.logoUrl}
                onChange={(e) => setCompanyForm({ ...companyForm, logoUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
              <Field.HelperText>
                Enter a URL to your company logo (recommended: square image, 200x200px)
              </Field.HelperText>
            </Field.Root>

            {companyForm.logoUrl && (
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Logo Preview:</Text>
                <Box
                  w={20}
                  h={20}
                  border="1px"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src={companyForm.logoUrl}
                    alt="Company Logo"
                    width={80}
                    height={80}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </Box>
              </Box>
            )}

            <Flex justify="flex-end" gap={2}>
              <Button type="submit" colorScheme="blue" loading={submitting}>
                Save Changes
              </Button>
            </Flex>
          </VStack>
        </form>
      </Card.Body>
    </Card.Root>
  );
}

