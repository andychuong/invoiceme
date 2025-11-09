package com.invoiceme.infrastructure.persistence.customer;

import com.invoiceme.domain.customer.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {
    Optional<Customer> findByEmail(String email);
    boolean existsByEmail(String email);
    
    // Company-scoped queries
    @Query("SELECT c FROM Customer c WHERE c.company.id = :companyId")
    Page<Customer> findByCompanyId(@Param("companyId") UUID companyId, Pageable pageable);
    
    @Query("SELECT c FROM Customer c WHERE c.company.id = :companyId")
    List<Customer> findAllByCompanyId(@Param("companyId") UUID companyId);
    
    @Query("SELECT c FROM Customer c WHERE c.id = :id AND c.company.id = :companyId")
    Optional<Customer> findByIdAndCompanyId(@Param("id") UUID id, @Param("companyId") UUID companyId);
}


