package com.invoiceme.infrastructure.api.controller;

import com.invoiceme.application.commands.payment.RecordPaymentCommand;
import com.invoiceme.application.commands.payment.RecordPaymentHandler;
import com.invoiceme.application.queries.payment.*;
import com.invoiceme.domain.payment.Payment;
import com.invoiceme.infrastructure.api.dto.payment.PaymentRequestDTO;
import com.invoiceme.infrastructure.api.dto.payment.PaymentResponseDTO;
import com.invoiceme.infrastructure.api.mapper.PaymentMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class PaymentController {
    private final RecordPaymentHandler recordPaymentHandler;
    private final GetPaymentByIdHandler getPaymentByIdHandler;
    private final ListPaymentsForInvoiceHandler listPaymentsForInvoiceHandler;
    private final PaymentMapper paymentMapper;

    public PaymentController(
            RecordPaymentHandler recordPaymentHandler,
            GetPaymentByIdHandler getPaymentByIdHandler,
            ListPaymentsForInvoiceHandler listPaymentsForInvoiceHandler,
            PaymentMapper paymentMapper) {
        this.recordPaymentHandler = recordPaymentHandler;
        this.getPaymentByIdHandler = getPaymentByIdHandler;
        this.listPaymentsForInvoiceHandler = listPaymentsForInvoiceHandler;
        this.paymentMapper = paymentMapper;
    }

    @PostMapping
    public ResponseEntity<PaymentResponseDTO> recordPayment(@Valid @RequestBody PaymentRequestDTO request) {
        RecordPaymentCommand command = new RecordPaymentCommand(
                request.getInvoiceId(),
                request.getAmount(),
                request.getPaymentDate(),
                request.getPaymentMethod(),
                request.getReferenceNumber()
        );
        Payment payment = recordPaymentHandler.handle(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentMapper.toResponseDTO(payment));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponseDTO> getPaymentById(@PathVariable UUID id) {
        GetPaymentByIdQuery query = new GetPaymentByIdQuery(id);
        Payment payment = getPaymentByIdHandler.handle(query);
        return ResponseEntity.ok(paymentMapper.toResponseDTO(payment));
    }

    @GetMapping("/invoices/{invoiceId}")
    public ResponseEntity<List<PaymentResponseDTO>> listPaymentsForInvoice(@PathVariable UUID invoiceId) {
        ListPaymentsForInvoiceQuery query = new ListPaymentsForInvoiceQuery(invoiceId);
        List<Payment> payments = listPaymentsForInvoiceHandler.handle(query);
        return ResponseEntity.ok(paymentMapper.toResponseDTOList(payments));
    }
}

