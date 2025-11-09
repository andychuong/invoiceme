package com.invoiceme.infrastructure.persistence.invoice;

import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.domain.invoice.InvoiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    
    @EntityGraph(attributePaths = {"customer"})
    @Query("SELECT i FROM Invoice i WHERE i.status = :status")
    Page<Invoice> findByStatus(@Param("status") InvoiceStatus status, Pageable pageable);
    
    @EntityGraph(attributePaths = {"customer"})
    @Query("SELECT i FROM Invoice i WHERE i.customer.id = :customerId")
    Page<Invoice> findByCustomerId(@Param("customerId") UUID customerId, Pageable pageable);
    
    @EntityGraph(attributePaths = {"customer"})
    @Query("SELECT i FROM Invoice i WHERE i.customer.id = :customerId AND i.status = :status")
    Page<Invoice> findByCustomerIdAndStatus(@Param("customerId") UUID customerId, 
                                            @Param("status") InvoiceStatus status, 
                                            Pageable pageable);
    
    @EntityGraph(attributePaths = {"customer"})
    @Query("SELECT i FROM Invoice i")
    Page<Invoice> findAllWithCustomer(Pageable pageable);
    
    boolean existsByInvoiceNumber(String invoiceNumber);
    
    // Company-scoped queries
    @EntityGraph(attributePaths = {"customer"})
    @Query("SELECT i FROM Invoice i WHERE i.company.id = :companyId")
    Page<Invoice> findByCompanyId(@Param("companyId") UUID companyId, Pageable pageable);
    
    @EntityGraph(attributePaths = {"customer"})
    @Query("SELECT i FROM Invoice i WHERE i.company.id = :companyId AND i.status = :status")
    Page<Invoice> findByCompanyIdAndStatus(@Param("companyId") UUID companyId, 
                                           @Param("status") InvoiceStatus status, 
                                           Pageable pageable);
    
    @EntityGraph(attributePaths = {"customer"})
    @Query("SELECT i FROM Invoice i WHERE i.id = :id AND i.company.id = :companyId")
    Optional<Invoice> findByIdAndCompanyId(@Param("id") UUID id, @Param("companyId") UUID companyId);
    
    @EntityGraph(attributePaths = {"customer"})
    @Query("SELECT i FROM Invoice i WHERE i.customer.id = :customerId AND i.company.id = :companyId")
    Page<Invoice> findByCustomerIdAndCompanyId(@Param("customerId") UUID customerId,
                                               @Param("companyId") UUID companyId,
                                               Pageable pageable);
}


