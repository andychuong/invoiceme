package com.invoiceme.domain.payment;

import com.invoiceme.domain.invoice.Invoice;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @Column(name = "reference_number")
    private String referenceNumber;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        validate();
    }

    private void validate() {
        if (invoice == null) {
            throw new IllegalArgumentException("Payment must have an invoice");
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment amount must be greater than zero");
        }
        if (paymentDate == null) {
            throw new IllegalArgumentException("Payment date cannot be null");
        }
        if (paymentMethod == null) {
            throw new IllegalArgumentException("Payment method cannot be null");
        }
        if (invoice.getStatus() == com.invoiceme.domain.invoice.InvoiceStatus.DRAFT) {
            throw new IllegalStateException("Cannot record payment for draft invoice");
        }
        if (amount.compareTo(invoice.getBalance()) > 0) {
            throw new IllegalArgumentException("Payment amount cannot exceed invoice balance");
        }
    }

    public static Payment create(Invoice invoice, BigDecimal amount, LocalDate paymentDate, 
                                 PaymentMethod paymentMethod, String referenceNumber) {
        Payment payment = new Payment();
        payment.setInvoice(invoice);
        payment.setAmount(amount);
        payment.setPaymentDate(paymentDate);
        payment.setPaymentMethod(paymentMethod);
        payment.setReferenceNumber(referenceNumber);
        return payment;
    }
}


