'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Button,
  Input,
  Text,
  VStack,
  Field,
  createListCollection,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  SelectContent,
  SelectItem,
} from '@chakra-ui/react';
import { usePaymentViewModel } from '@/viewmodels/PaymentViewModel';
import { toast } from 'sonner';
import { CreatePaymentRequest, PaymentMethod } from '@/types';
import { format } from 'date-fns';

const paymentSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  paymentMethod: z.nativeEnum(PaymentMethod, {
    message: 'Payment method is required',
  }),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  invoiceId: string;
  invoiceBalance: number;
  onPaymentRecorded?: () => void;
}

export function PaymentForm({ invoiceId, invoiceBalance, onPaymentRecorded }: PaymentFormProps) {
  const { recordPayment, validatePaymentAmount, loading } = usePaymentViewModel();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: invoiceBalance,
      paymentDate: format(new Date(), 'yyyy-MM-dd'),
      paymentMethod: PaymentMethod.CASH,
      referenceNumber: '',
      notes: '',
    },
  });

  const paymentMethodValue = watch('paymentMethod');

  const paymentMethodCollection = createListCollection({
    items: [
      { value: PaymentMethod.CASH, label: 'Cash' },
      { value: PaymentMethod.CHECK, label: 'Check' },
      { value: PaymentMethod.CREDIT_CARD, label: 'Credit Card' },
      { value: PaymentMethod.BANK_TRANSFER, label: 'Bank Transfer' },
      { value: PaymentMethod.OTHER, label: 'Other' },
    ],
  });

  const onSubmit = async (values: PaymentFormValues) => {
    if (!validatePaymentAmount(values.amount, invoiceBalance)) {
      toast.error(`Payment amount cannot exceed invoice balance of $${invoiceBalance.toFixed(2)}`);
      return;
    }

    try {
      const requestData: CreatePaymentRequest = {
        invoiceId,
        amount: values.amount,
        paymentDate: values.paymentDate,
        paymentMethod: values.paymentMethod,
        referenceNumber: values.referenceNumber || undefined,
        notes: values.notes || undefined,
      };

      await recordPayment(requestData);
      toast.success('Payment recorded successfully');
      reset({
        amount: invoiceBalance,
        paymentDate: format(new Date(), 'yyyy-MM-dd'),
        paymentMethod: PaymentMethod.CASH,
        referenceNumber: '',
        notes: '',
      });
      if (onPaymentRecorded) {
        onPaymentRecorded();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to record payment';
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={4} align="stretch">
        <Field.Root invalid={!!errors.amount} required>
          <Field.Label fontWeight="medium" fontSize="sm">Amount</Field.Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            max={invoiceBalance}
            size="md"
            {...register('amount', { valueAsNumber: true })}
          />
          <Field.ErrorText>{errors.amount?.message}</Field.ErrorText>
          <Text fontSize="xs" color="gray.600" mt={1}>
            Maximum: ${invoiceBalance.toFixed(2)}
          </Text>
        </Field.Root>

        <Field.Root invalid={!!errors.paymentDate} required>
          <Field.Label fontWeight="medium" fontSize="sm">Payment Date</Field.Label>
          <Input
            type="date"
            size="md"
            {...register('paymentDate')}
          />
          <Field.ErrorText>{errors.paymentDate?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.paymentMethod} required>
          <Field.Label fontWeight="medium" fontSize="sm">Payment Method</Field.Label>
          <SelectRoot
            collection={paymentMethodCollection}
            value={[paymentMethodValue || PaymentMethod.CASH]}
            onValueChange={(details) => setValue('paymentMethod', details.value[0] as PaymentMethod)}
            size="md"
            positioning={{ 
              placement: 'bottom-start',
              strategy: 'absolute',
              offset: { mainAxis: 4 }
            }}
          >
            <SelectTrigger>
              <SelectValueText placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent 
              position="absolute"
              zIndex={1000}
            >
              {paymentMethodCollection.items.map((item) => (
                <SelectItem key={item.value} item={item}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
          <Field.ErrorText>{errors.paymentMethod?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.referenceNumber}>
          <Field.Label fontWeight="medium" fontSize="sm">Reference Number</Field.Label>
          <Input
            placeholder="Check number, transaction ID, etc."
            size="md"
            {...register('referenceNumber')}
          />
          <Field.ErrorText>{errors.referenceNumber?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.notes}>
          <Field.Label fontWeight="medium" fontSize="sm">Notes</Field.Label>
          <Input
            placeholder="Additional notes"
            size="md"
            {...register('notes')}
          />
          <Field.ErrorText>{errors.notes?.message}</Field.ErrorText>
        </Field.Root>

        <Button
          type="submit"
          width="full"
          bg="primary.500"
          color="white"
          _hover={{ bg: 'primary.600' }}
          loading={loading}
          loadingText="Recording..."
          size="md"
        >
          Record Payment
        </Button>
      </VStack>
    </form>
  );
}

