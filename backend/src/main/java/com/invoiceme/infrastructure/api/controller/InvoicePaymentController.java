package com.invoiceme.infrastructure.api.controller;

import com.invoiceme.application.queries.payment.ListPaymentsForInvoiceQuery;
import com.invoiceme.application.queries.payment.ListPaymentsForInvoiceHandler;
import com.invoiceme.domain.payment.Payment;
import com.invoiceme.infrastructure.api.dto.payment.PaymentResponseDTO;
import com.invoiceme.infrastructure.api.mapper.PaymentMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class InvoicePaymentController {
    private final ListPaymentsForInvoiceHandler listPaymentsForInvoiceHandler;
    private final PaymentMapper paymentMapper;

    public InvoicePaymentController(
            ListPaymentsForInvoiceHandler listPaymentsForInvoiceHandler,
            PaymentMapper paymentMapper) {
        this.listPaymentsForInvoiceHandler = listPaymentsForInvoiceHandler;
        this.paymentMapper = paymentMapper;
    }

    @GetMapping("/{invoiceId}/payments")
    public ResponseEntity<List<PaymentResponseDTO>> listPaymentsForInvoice(@PathVariable UUID invoiceId) {
        ListPaymentsForInvoiceQuery query = new ListPaymentsForInvoiceQuery(invoiceId);
        List<Payment> payments = listPaymentsForInvoiceHandler.handle(query);
        return ResponseEntity.ok(paymentMapper.toResponseDTOList(payments));
    }
}

