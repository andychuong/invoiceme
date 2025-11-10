package com.invoiceme.application.queries.invoice;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListInvoicesByCustomerQuery {
    private UUID companyId;
    private UUID customerId;
    private Pageable pageable;
}

