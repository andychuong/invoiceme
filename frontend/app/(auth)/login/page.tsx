'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  Container,
  Heading,
  Input,
  Text,
  VStack,
  Field,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      await authService.login(values);
      toast.success('Login successful');
      router.push('/customers');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      bg="gray.50" 
      px={4}
      py={8}
      position="relative"
    >
      {/* Background decorative elements */}
      <Box
        position="absolute"
        inset={0}
        overflow="hidden"
        pointerEvents="none"
        zIndex={0}
      >
        <Box
          position="absolute"
          top={20}
          left={20}
          w={72}
          h={72}
          bg="primary.400"
          opacity={0.1}
          borderRadius="full"
          filter="blur(60px)"
        />
        <Box
          position="absolute"
          bottom={20}
          right={20}
          w={96}
          h={96}
          bg="amber.400"
          opacity={0.1}
          borderRadius="full"
          filter="blur(60px)"
        />
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w={80}
          h={80}
          bg="success.400"
          opacity={0.1}
          borderRadius="full"
          filter="blur(60px)"
        />
      </Box>

      {/* Logo outside modal */}
      <Box
        position="absolute"
        top={8}
        left={8}
        display="flex"
        alignItems="center"
        gap={3}
        zIndex={1}
      >
        <Box 
          w={12} 
          h={12} 
          bg="white" 
          borderRadius="2xl" 
          shadow="lg" 
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image 
            src="/assets/logo.svg" 
            alt="InvoiceMe Logo"
            width={40}
            height={40}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        </Box>
        <Heading size="xl" color="gray.900" fontWeight="bold">
          InvoiceMe
        </Heading>
      </Box>

      <Container maxW="md" w="full" position="relative" zIndex={1}>
        <Card.Root w="full" shadow="2xl" borderRadius="xl">
          <Card.Body p={8}>
            <VStack gap={6} align="stretch">
              <VStack gap={2} align="center">
                <Heading size="2xl" color="gray.900" fontWeight="bold" textAlign="center">
                  Welcome Back
                </Heading>
                <Text color="gray.600" fontSize="md" textAlign="center">
                  Sign in to your InvoiceMe account
                </Text>
              </VStack>

              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack gap={6} align="stretch">
                  <Field.Root invalid={!!errors.username}>
                    <Field.Label fontWeight="semibold" fontSize="sm" mb={2}>
                      Username
                    </Field.Label>
                    <Input
                      size="lg"
                      placeholder="Enter your username"
                      {...register('username')}
                    />
                    <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.password}>
                    <Field.Label fontWeight="semibold" fontSize="sm" mb={2}>
                      Password
                    </Field.Label>
                    <Input
                      size="lg"
                      type="password"
                      placeholder="Enter your password"
                      {...register('password')}
                    />
                    <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                  </Field.Root>

                  <Button
                    type="submit"
                    width="full"
                    size="lg"
                    bg="primary.500"
                    color="white"
                    _hover={{ bg: 'primary.600' }}
                    shadow="md"
                    loading={loading}
                    loadingText="Signing in..."
                    mt={2}
                  >
                    Sign In
                  </Button>
                </VStack>
              </form>

              {/* Sign Up Link */}
              <Text color="gray.600" textAlign="center" fontSize="sm">
                Don't have an account?{' '}
                <ChakraLink as={Link} href="/signup" color="primary.500" fontWeight="semibold">
                  Sign up
                </ChakraLink>
              </Text>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Container>
    </Box>
  );
}

