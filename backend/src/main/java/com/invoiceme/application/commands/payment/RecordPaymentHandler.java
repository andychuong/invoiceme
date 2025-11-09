package com.invoiceme.application.commands.payment;

import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.domain.payment.Payment;
import com.invoiceme.domain.payment.PaymentMethod;
import com.invoiceme.infrastructure.persistence.invoice.InvoiceRepository;
import com.invoiceme.infrastructure.persistence.payment.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class RecordPaymentHandler {
    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;

    public RecordPaymentHandler(PaymentRepository paymentRepository, InvoiceRepository invoiceRepository) {
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
    }

    @Transactional
    public Payment handle(RecordPaymentCommand command) {
        Invoice invoice = invoiceRepository.findById(command.getInvoiceId())
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found with id: " + command.getInvoiceId()));

        PaymentMethod paymentMethod;
        try {
            paymentMethod = PaymentMethod.valueOf(command.getPaymentMethod().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid payment method: " + command.getPaymentMethod());
        }

        Payment payment = Payment.create(
                invoice,
                command.getAmount(),
                command.getPaymentDate(),
                paymentMethod,
                command.getReferenceNumber()
        );

        payment = paymentRepository.save(payment);

        // Update invoice balance
        BigDecimal totalPayments = paymentRepository.getTotalPaymentsByInvoiceId(command.getInvoiceId());
        invoice.calculateBalance(totalPayments);
        invoiceRepository.save(invoice);

        return payment;
    }
}

