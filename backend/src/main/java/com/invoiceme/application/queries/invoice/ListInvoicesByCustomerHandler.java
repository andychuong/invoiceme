package com.invoiceme.application.queries.invoice;

import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.infrastructure.persistence.invoice.InvoiceRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ListInvoicesByCustomerHandler {
    private final InvoiceRepository invoiceRepository;

    public ListInvoicesByCustomerHandler(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    @Transactional(readOnly = true)
    public Page<Invoice> handle(ListInvoicesByCustomerQuery query) {
        return invoiceRepository.findByCustomerId(query.getCustomerId(), query.getPageable());
    }
}

