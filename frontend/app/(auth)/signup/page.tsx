'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Heading,
  Input,
  VStack,
  Text,
  Tabs,
  Field,
  HStack,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Reusable Components
const DecorativeCircle = ({ top, right, bottom, left, size, bg }: any) => (
  <Box
    position="absolute"
    top={top}
    right={right}
    bottom={bottom}
    left={left}
    w={size}
    h={size}
    borderRadius="full"
    bg={bg}
    bgGradient={bg?.startsWith('radial') ? bg : undefined}
  />
);

const FeatureItem = ({ title, description }: { title: string; description: string }) => (
  <HStack color="white" alignItems="flex-start">
    <Box w="8px" h="8px" borderRadius="full" bg="white" mt={2} flexShrink={0} />
    <VStack alignItems="flex-start" gap={0}>
      <Text fontWeight="semibold">{title}</Text>
      <Text fontSize="sm" opacity={0.9}>{description}</Text>
    </VStack>
  </HStack>
);

const FormField = ({ label, type = 'text', value, onChange, placeholder, required = true }: any) => (
  <Field.Root>
    <Field.Label>{label}</Field.Label>
    <Input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
    />
  </Field.Root>
);

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [signupMode, setSignupMode] = useState<'create' | 'join'>('create');

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [createForm, setCreateForm] = useState({
    username: '',
    password: '',
    email: '',
    displayName: '',
    companyName: '',
  });
  const [joinForm, setJoinForm] = useState({
    username: '',
    password: '',
    email: '',
    displayName: '',
    companyCode: '',
  });

  const handleAuthSubmit = async (endpoint: string, data: any, successMessage: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Request failed');
      }

      const responseData = await response.json();
      authService.setToken(responseData.token);
      authService.setUserData(responseData);

      toast.success(successMessage);
      router.push('/customers');
    } catch (error: any) {
      toast.error(error.message || 'Request failed. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuthSubmit('/auth/login', loginForm, 'Welcome back!');
  };

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuthSubmit(
      '/auth/signup',
      createForm,
      `Welcome! You are now an admin.`
    );
  };

  const handleJoinCompany = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuthSubmit(
      '/auth/join',
      joinForm,
      'Welcome to the team!'
    );
  };

  const features = [
    { title: 'Lightning Fast', description: 'Create invoices in under 30 seconds' },
    { title: 'Payment Tracking', description: 'Monitor payments and outstanding balances' },
    { title: 'Powerful Analytics', description: 'Real-time revenue tracking' },
  ];

  return (
    <Grid
      templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
      minH="100vh"
      bg="white"
      position="relative"
      overflow="hidden"
    >
      {/* Left Side - Marketing */}
      <GridItem
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={{ base: 8, lg: 16 }}
        position="relative"
        overflow="visible"
      >
        {/* Decorative Circles */}
        <DecorativeCircle top="-50px" right="-100px" size="300px" bg="whiteAlpha.200" />
        <DecorativeCircle bottom="-30px" left="-30px" size="150px" bg="whiteAlpha.200" />
        <DecorativeCircle top="20%" left="5%" size="100px" bg="whiteAlpha.100" />
        <DecorativeCircle bottom="30%" left="10%" size="80px" bg="whiteAlpha.150" />
        <DecorativeCircle top="60%" right="-50px" size="120px" bg="whiteAlpha.100" />

        <VStack gap={8} maxW="lg" zIndex={1}>
          <VStack gap={4} textAlign={{ base: 'center', lg: 'left' }} alignItems="flex-start" w="100%">
            <Heading size="4xl" fontWeight="bold" color="white" lineHeight="1.2">
              The World's Most Powerful Invoicing Tool
            </Heading>
            <Text fontSize="lg" color="whiteAlpha.900">
              Create your professional invoices with the fastest invoice building platform.
              Manage customers, track payments, and grow your business with ease.
            </Text>
          </VStack>

          <VStack gap={4} w="100%" alignItems="flex-start">
            {features.map((feature) => (
              <FeatureItem key={feature.title} {...feature} />
            ))}
          </VStack>
        </VStack>
      </GridItem>

      {/* Right Side - Auth Forms */}
      <GridItem
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={{ base: 8, lg: 12 }}
        bg="gray.50"
        position="relative"
        overflow="visible"
      >
        {/* Decorative Circles */}
        <DecorativeCircle
          top="-80px"
          left="-80px"
          size="250px"
          bg="radial(rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.1))"
        />
        <DecorativeCircle
          bottom="-60px"
          right="-60px"
          size="180px"
          bg="radial(rgba(118, 75, 162, 0.15), rgba(102, 126, 234, 0.1))"
        />
        <DecorativeCircle
          top="30%"
          right="10%"
          size="120px"
          bg="radial(rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.08))"
        />
        <DecorativeCircle
          bottom="20%"
          left="5%"
          size="90px"
          bg="radial(rgba(118, 75, 162, 0.12), rgba(102, 126, 234, 0.08))"
        />

        <Box w="100%" maxW="md" zIndex={1} position="relative">
          <VStack gap={8} w="100%">
            <VStack gap={2} textAlign="center" w="100%">
              <Heading size="2xl" color="gray.800">
                {authMode === 'login' ? 'Sign in Now' : 'Get Started Free'}
              </Heading>
              <Text color="gray.600">
                {authMode === 'login'
                  ? 'Enter your credentials to access your account'
                  : 'No credit card required • Start in 60 seconds'}
              </Text>
            </VStack>

            <HStack gap={4} w="100%" justifyContent="center">
              <Button
                variant={authMode === 'login' ? 'solid' : 'ghost'}
                colorScheme="purple"
                onClick={() => setAuthMode('login')}
                px={8}
              >
                Sign In
              </Button>
              <Button
                variant={authMode === 'signup' ? 'solid' : 'ghost'}
                colorScheme="purple"
                onClick={() => setAuthMode('signup')}
                px={8}
              >
                Sign Up
              </Button>
            </HStack>

            <Box w="100%" bg="white" p={8} borderRadius="xl" boxShadow="lg">
              {authMode === 'login' ? (
                <form onSubmit={handleLogin}>
                  <VStack gap={4}>
                    <FormField
                      label="Username or Email"
                      value={loginForm.username}
                      onChange={(e: any) => setLoginForm({ ...loginForm, username: e.target.value })}
                      placeholder="Enter your username or email"
                    />
                    <FormField
                      label="Password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e: any) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="Enter your password"
                    />
                    <Button
                      type="submit"
                      colorScheme="purple"
                      width="100%"
                      size="lg"
                      loading={isLoading}
                      loadingText="Signing in..."
                    >
                      Sign In
                    </Button>
                  </VStack>
                </form>
              ) : (
                <Tabs.Root
                  value={signupMode}
                  onValueChange={(e) => setSignupMode(e.value as 'create' | 'join')}
                  w="100%"
                >
                  <Tabs.List mb={4}>
                    <Tabs.Trigger value="create">Create Company</Tabs.Trigger>
                    <Tabs.Trigger value="join">Join Company</Tabs.Trigger>
                  </Tabs.List>

                  <Tabs.Content value="create" pt={6}>
                    <form onSubmit={handleCreateCompany}>
                      <VStack gap={4}>
                        <FormField
                          label="Username"
                          value={createForm.username}
                          onChange={(e: any) => setCreateForm({ ...createForm, username: e.target.value })}
                          placeholder="Enter your username"
                        />
                        <FormField
                          label="Password"
                          type="password"
                          value={createForm.password}
                          onChange={(e: any) => setCreateForm({ ...createForm, password: e.target.value })}
                          placeholder="Enter your password"
                        />
                        <FormField
                          label="Email"
                          type="email"
                          value={createForm.email}
                          onChange={(e: any) => setCreateForm({ ...createForm, email: e.target.value })}
                          placeholder="Enter your email"
                        />
                        <FormField
                          label="Display Name"
                          value={createForm.displayName}
                          onChange={(e: any) => setCreateForm({ ...createForm, displayName: e.target.value })}
                          placeholder="Enter your full name"
                        />
                        <FormField
                          label="Company Name"
                          value={createForm.companyName}
                          onChange={(e: any) => setCreateForm({ ...createForm, companyName: e.target.value })}
                          placeholder="Enter your company name"
                        />
                        <Button
                          type="submit"
                          colorScheme="purple"
                          width="100%"
                          size="lg"
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
                        <FormField
                          label="Username"
                          value={joinForm.username}
                          onChange={(e: any) => setJoinForm({ ...joinForm, username: e.target.value })}
                          placeholder="Enter your username"
                        />
                        <FormField
                          label="Password"
                          type="password"
                          value={joinForm.password}
                          onChange={(e: any) => setJoinForm({ ...joinForm, password: e.target.value })}
                          placeholder="Enter your password"
                        />
                        <FormField
                          label="Email"
                          type="email"
                          value={joinForm.email}
                          onChange={(e: any) => setJoinForm({ ...joinForm, email: e.target.value })}
                          placeholder="Enter your email"
                        />
                        <FormField
                          label="Display Name"
                          value={joinForm.displayName}
                          onChange={(e: any) => setJoinForm({ ...joinForm, displayName: e.target.value })}
                          placeholder="Enter your full name"
                        />
                        <FormField
                          label="Company Code"
                          value={joinForm.companyCode}
                          onChange={(e: any) => setJoinForm({ ...joinForm, companyCode: e.target.value })}
                          placeholder="Enter company code from your admin"
                        />
                        <Button
                          type="submit"
                          colorScheme="purple"
                          width="100%"
                          size="lg"
                          loading={isLoading}
                          loadingText="Joining company..."
                        >
                          Join Company & Sign Up
                        </Button>
                      </VStack>
                    </form>
                  </Tabs.Content>
                </Tabs.Root>
              )}
            </Box>
          </VStack>
        </Box>
      </GridItem>
    </Grid>
  );
}
