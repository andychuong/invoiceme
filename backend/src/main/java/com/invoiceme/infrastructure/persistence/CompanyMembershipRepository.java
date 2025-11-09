package com.invoiceme.infrastructure.persistence;

import com.invoiceme.domain.user.CompanyMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompanyMembershipRepository extends JpaRepository<CompanyMembership, UUID> {
    @Query("SELECT cm FROM CompanyMembership cm JOIN FETCH cm.company WHERE cm.user.id = :userId")
    List<CompanyMembership> findByUserId(@Param("userId") UUID userId);
    
    List<CompanyMembership> findByCompanyId(UUID companyId);
    Optional<CompanyMembership> findByUserIdAndCompanyId(UUID userId, UUID companyId);
    
    @Query("SELECT cm FROM CompanyMembership cm WHERE cm.user.id = :userId AND cm.company.id = :companyId")
    Optional<CompanyMembership> findMembership(@Param("userId") UUID userId, @Param("companyId") UUID companyId);
}

