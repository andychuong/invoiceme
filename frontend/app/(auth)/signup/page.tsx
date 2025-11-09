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
  Stack,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import Link from 'next/link';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

// API URL - use environment variable or fallback to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

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
      const response = await fetch(`${API_URL}/auth/signup`, {
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
      const response = await fetch(`${API_URL}/auth/join`, {
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
    <Box minH="100vh" position="relative" overflow="hidden">
      {/* Gradient Background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="60vh"
        bgGradient="linear(to-br, blue.600, purple.600)"
        zIndex={-1}
      />
      
      <Container maxW="7xl" py={12}>
        {/* Header/Hero Section */}
        <VStack gap={12} mb={16}>
          <VStack gap={4} textAlign="center" color="white" pt={8}>
            <Heading size="4xl" fontWeight="bold" letterSpacing="tight">
              InvoiceMe
            </Heading>
            <Heading size="2xl" fontWeight="normal" maxW="3xl">
              Effortless Invoicing for Modern Businesses
            </Heading>
            <Text fontSize="xl" maxW="2xl" opacity={0.9}>
              Create professional invoices in seconds, track payments effortlessly, 
              and grow your business with powerful insights. All in one beautiful platform.
            </Text>
          </VStack>

          {/* Feature Cards */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} w="100%" mt={8}>
            <Box bg="whiteAlpha.200" backdropFilter="blur(10px)" p={6} borderRadius="xl" color="white">
              <Text fontSize="3xl" mb={3}>⚡</Text>
              <Heading size="md" mb={2}>Lightning Fast</Heading>
              <Text opacity={0.9}>Create and send invoices in under 30 seconds</Text>
            </Box>
            <Box bg="whiteAlpha.200" backdropFilter="blur(10px)" p={6} borderRadius="xl" color="white">
              <Text fontSize="3xl" mb={3}>🔒</Text>
              <Heading size="md" mb={2}>Secure & Private</Heading>
              <Text opacity={0.9}>Bank-level encryption keeps your data safe</Text>
            </Box>
            <Box bg="whiteAlpha.200" backdropFilter="blur(10px)" p={6} borderRadius="xl" color="white">
              <Text fontSize="3xl" mb={3}>📊</Text>
              <Heading size="md" mb={2}>Powerful Analytics</Heading>
              <Text opacity={0.9}>Track revenue and payments in real-time</Text>
            </Box>
          </SimpleGrid>
        </VStack>

        {/* Signup Form */}
        <Box maxW="md" mx="auto">
          <Box bg="white" p={8} borderRadius="2xl" boxShadow="2xl">
            <VStack gap={6}>
              <VStack gap={2} textAlign="center">
                <Heading size="xl" color="gray.800">Get Started Free</Heading>
                <Text color="gray.600">No credit card required • Start in 60 seconds</Text>
              </VStack>

              <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value as 'create' | 'join')} w="100%">
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

              <Text color="gray.600" textAlign="center" fontSize="sm" mt={4}>
                Already have an account?{' '}
                <ChakraLink as={Link} href="/login" color="blue.600" fontWeight="medium">
                  Sign in
                </ChakraLink>
              </Text>
            </VStack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
