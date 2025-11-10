package com.invoiceme.application.queries.invoice;

import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.infrastructure.persistence.invoice.InvoiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class GetInvoiceByIdHandler {
    private final InvoiceRepository invoiceRepository;

    public GetInvoiceByIdHandler(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    @Transactional(readOnly = true)
    public Invoice handle(GetInvoiceByIdQuery query) {
        return invoiceRepository.findByIdAndCompanyId(query.getId(), query.getCompanyId())
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found with id: " + query.getId()));
    }
}

