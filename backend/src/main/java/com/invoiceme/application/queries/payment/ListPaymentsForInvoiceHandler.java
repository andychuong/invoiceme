package com.invoiceme.application.queries.payment;

import com.invoiceme.domain.payment.Payment;
import com.invoiceme.infrastructure.persistence.payment.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ListPaymentsForInvoiceHandler {
    private final PaymentRepository paymentRepository;

    public ListPaymentsForInvoiceHandler(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Transactional(readOnly = true)
    public List<Payment> handle(ListPaymentsForInvoiceQuery query) {
        return paymentRepository.findByInvoiceId(query.getInvoiceId());
    }
}

