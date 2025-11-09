import { Card, VStack, Heading, Text } from '@chakra-ui/react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card.Root>
      <Card.Body>
        <VStack gap={4} py={8}>
          <Inbox size={48} color="#6B7280" />
          <Heading size="lg" color="gray.900">
            {title}
          </Heading>
          {description && (
            <Text color="gray.600" textAlign="center">
              {description}
            </Text>
          )}
          {action && <div>{action}</div>}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

