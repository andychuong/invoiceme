package com.invoiceme.infrastructure.persistence.payment;

import com.invoiceme.domain.payment.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    @Query("SELECT p FROM Payment p WHERE p.invoice.id = :invoiceId ORDER BY p.paymentDate DESC, p.createdAt DESC")
    List<Payment> findByInvoiceId(@Param("invoiceId") UUID invoiceId);
    
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.invoice.id = :invoiceId")
    java.math.BigDecimal getTotalPaymentsByInvoiceId(@Param("invoiceId") UUID invoiceId);
}


