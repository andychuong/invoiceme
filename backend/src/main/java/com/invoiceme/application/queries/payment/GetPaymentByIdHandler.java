package com.invoiceme.application.queries.payment;

import com.invoiceme.domain.payment.Payment;
import com.invoiceme.infrastructure.persistence.payment.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class GetPaymentByIdHandler {
    private final PaymentRepository paymentRepository;

    public GetPaymentByIdHandler(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Transactional(readOnly = true)
    public Payment handle(GetPaymentByIdQuery query) {
        return paymentRepository.findById(query.getId())
                .orElseThrow(() -> new IllegalArgumentException("Payment not found with id: " + query.getId()));
    }
}

