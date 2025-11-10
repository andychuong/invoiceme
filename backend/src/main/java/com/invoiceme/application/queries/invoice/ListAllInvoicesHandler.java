package com.invoiceme.application.queries.invoice;

import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.infrastructure.persistence.invoice.InvoiceRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ListAllInvoicesHandler {
    private final InvoiceRepository invoiceRepository;

    public ListAllInvoicesHandler(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    @Transactional(readOnly = true)
    public Page<Invoice> handle(ListAllInvoicesQuery query) {
        return invoiceRepository.findByCompanyId(query.getCompanyId(), query.getPageable());
    }
}

