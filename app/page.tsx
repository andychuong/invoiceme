'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { Box } from '@chakra-ui/react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        router.push('/customers');
      } else {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minH="100vh">
      <LoadingSpinner />
    </Box>
  );
}
