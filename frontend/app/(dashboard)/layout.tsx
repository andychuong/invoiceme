'use client';

import { useEffect, useState, useLayoutEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/authService';
import Link from 'next/link';
import Image from 'next/image';
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { LogOut, Users, FileText, CreditCard, User } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        const storedUsername = authService.getUsername();
        setUsername(storedUsername);
      } else {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router, mounted]);

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
  };

  // Show loading state while checking authentication or mounting
  if (!mounted || isAuthenticated === null) {
    return (
      <Flex minH="100vh" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="primary.500" borderWidth="4px" />
      </Flex>
    );
  }

  // Don't render layout if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { href: '/customers', label: 'Customers', icon: Users },
    { href: '/invoices', label: 'Invoices', icon: FileText },
    { href: '/payments', label: 'Payments', icon: CreditCard },
  ];

  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="white" borderBottom="1px" borderColor="gray.200" shadow="sm">
        <Container maxW="7xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            <HStack gap={10}>
              <Link href="/customers">
                <HStack gap={3} cursor="pointer" _hover={{ opacity: 0.8 }} transition="opacity 0.2s">
                  <Box 
                    w={10} 
                    h={10} 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                    flexShrink={0}
                  >
                    <Image 
                      src="/assets/logo.svg" 
                      alt="InvoiceMe Logo"
                      width={40}
                      height={40}
                      style={{ width: '100%', height: '100%', display: 'block' }}
                    />
                  </Box>
                  <Heading size="xl" color="gray.900" fontWeight="bold" lineHeight="1" letterSpacing="tight">
                    InvoiceMe
                  </Heading>
                </HStack>
              </Link>
              <HStack gap={1} display={{ base: 'none', md: 'flex' }}>
                {navItems.map((item) => {
                  const NavIcon = item.icon;
                  const isActive = pathname?.startsWith(item.href);
                  return (
                    <Link key={item.href} href={item.href}>
                      <Box
                        px={4}
                        py={2}
                        cursor="pointer"
                        color={isActive ? 'primary.500' : 'gray.600'}
                        fontWeight={isActive ? 'semibold' : 'medium'}
                        fontSize="sm"
                        borderBottom="2px solid"
                        borderColor={isActive ? 'primary.500' : 'transparent'}
                        transition="all 0.2s"
                        _hover={{ 
                          color: isActive ? 'primary.600' : 'gray.900',
                          borderColor: isActive ? 'primary.600' : 'gray.300'
                        }}
                      >
                        <HStack gap={2}>
                          <NavIcon size={16} />
                          <Box>{item.label}</Box>
                        </HStack>
                      </Box>
                    </Link>
                  );
                })}
              </HStack>
            </HStack>
            <HStack gap={3}>
              {mounted && username && (
                <HStack gap={2} px={3} py={1.5} borderRadius="md" bg="gray.50" _hover={{ bg: 'gray.100' }} transition="background 0.2s">
                  <Box
                    w={8}
                    h={8}
                    borderRadius="full"
                    bg="primary.500"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                  >
                    <User size={16} />
                  </Box>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    {username}
                  </Text>
                </HStack>
              )}
              <Button
                variant="ghost"
                onClick={handleLogout}
                color="gray.600"
                size="sm"
                _hover={{ color: 'gray.900', bg: 'gray.100' }}
              >
                <LogOut size={16} style={{ marginRight: '8px' }} />
                Logout
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>
      <Container maxW="7xl" py={8}>
        {children}
      </Container>
    </Box>
  );
}

