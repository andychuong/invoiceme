package com.invoiceme.application.queries.invoice;

import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.domain.invoice.InvoiceStatus;
import com.invoiceme.infrastructure.persistence.invoice.InvoiceRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ListInvoicesByStatusHandler {
    private final InvoiceRepository invoiceRepository;

    public ListInvoicesByStatusHandler(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    @Transactional(readOnly = true)
    public Page<Invoice> handle(ListInvoicesByStatusQuery query) {
        InvoiceStatus status;
        try {
            status = InvoiceStatus.valueOf(query.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid invoice status: " + query.getStatus());
        }
        return invoiceRepository.findByStatus(status, query.getPageable());
    }
}

