'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  VStack,
  Text,
  Tabs,
  Link as ChakraLink,
  Field,
  HStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');

  // Create Company form
  const [createForm, setCreateForm] = useState({
    username: '',
    password: '',
    email: '',
    displayName: '',
    companyName: '',
  });

  // Join Company form
  const [joinForm, setJoinForm] = useState({
    username: '',
    password: '',
    email: '',
    displayName: '',
    companyCode: '',
  });

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Signup failed');
      }

      const data = await response.json();
      authService.setToken(data.token);
      authService.setUserData(data);

      toast.success(`Welcome to ${data.companyName}! You are now an admin.`);
      router.push('/customers');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(joinForm),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Join failed');
      }

      const data = await response.json();
      authService.setToken(data.token);
      authService.setUserData(data);

      toast.success(`Welcome to ${data.companyName}!`);
      router.push('/customers');
    } catch (error: any) {
      toast.error(error.message || 'Join failed. Please check your company code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="md">
        <VStack gap={8}>
          <VStack gap={2}>
            <Heading size="xl" color="blue.600">InvoiceMe</Heading>
            <Text color="gray.600">Create your account</Text>
          </VStack>

          <Box w="100%" bg="white" p={8} borderRadius="lg" boxShadow="md">
            <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value as 'create' | 'join')}>
              <Tabs.List>
                <Tabs.Trigger value="create">Create Company</Tabs.Trigger>
                <Tabs.Trigger value="join">Join Company</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="create" pt={6}>
                <form onSubmit={handleCreateCompany}>
                  <VStack gap={4}>
                    <Field.Root>
                      <Field.Label>Username</Field.Label>
                      <Input
                        value={createForm.username}
                        onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                        placeholder="Enter your username"
                        required
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Password</Field.Label>
                      <Input
                        type="password"
                        value={createForm.password}
                        onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                        placeholder="Enter your password"
                        required
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Email</Field.Label>
                      <Input
                        type="email"
                        value={createForm.email}
                        onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                        placeholder="Enter your email"
                        required
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Display Name</Field.Label>
                      <Input
                        value={createForm.displayName}
                        onChange={(e) => setCreateForm({ ...createForm, displayName: e.target.value })}
                        placeholder="Enter your full name"
                        required
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Company Name</Field.Label>
                      <Input
                        value={createForm.companyName}
                        onChange={(e) => setCreateForm({ ...createForm, companyName: e.target.value })}
                        placeholder="Enter your company name"
                        required
                      />
                    </Field.Root>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      width="100%"
                      loading={isLoading}
                      loadingText="Creating account..."
                    >
                      Create Company & Sign Up
                    </Button>
                  </VStack>
                </form>
              </Tabs.Content>

              <Tabs.Content value="join" pt={6}>
                <form onSubmit={handleJoinCompany}>
                  <VStack gap={4}>
                    <Field.Root>
                      <Field.Label>Username</Field.Label>
                      <Input
                        value={joinForm.username}
                        onChange={(e) => setJoinForm({ ...joinForm, username: e.target.value })}
                        placeholder="Enter your username"
                        required
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Password</Field.Label>
                      <Input
                        type="password"
                        value={joinForm.password}
                        onChange={(e) => setJoinForm({ ...joinForm, password: e.target.value })}
                        placeholder="Enter your password"
                        required
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Email</Field.Label>
                      <Input
                        type="email"
                        value={joinForm.email}
                        onChange={(e) => setJoinForm({ ...joinForm, email: e.target.value })}
                        placeholder="Enter your email"
                        required
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Display Name</Field.Label>
                      <Input
                        value={joinForm.displayName}
                        onChange={(e) => setJoinForm({ ...joinForm, displayName: e.target.value })}
                        placeholder="Enter your full name"
                        required
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Company Code</Field.Label>
                      <Input
                        value={joinForm.companyCode}
                        onChange={(e) => setJoinForm({ ...joinForm, companyCode: e.target.value })}
                        placeholder="Enter company code from your admin"
                        required
                      />
                      <Field.HelperText>
                        Ask your company admin for the company code
                      </Field.HelperText>
                    </Field.Root>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      width="100%"
                      loading={isLoading}
                      loadingText="Joining company..."
                    >
                      Join Company & Sign Up
                    </Button>
                  </VStack>
                </form>
              </Tabs.Content>
            </Tabs.Root>
          </Box>

          <Text color="gray.600">
            Already have an account?{' '}
            <ChakraLink as={Link} href="/login" color="blue.600" fontWeight="medium">
              Sign in
            </ChakraLink>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
