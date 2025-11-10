package com.invoiceme.application.commands.invoice;

import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.infrastructure.persistence.invoice.InvoiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class MarkInvoiceAsSentHandler {
    private final InvoiceRepository invoiceRepository;

    public MarkInvoiceAsSentHandler(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    @Transactional
    public Invoice handle(MarkInvoiceAsSentCommand command) {
        Invoice invoice = invoiceRepository.findByIdAndCompanyId(command.getId(), command.getCompanyId())
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found with id: " + command.getId()));
        
        invoice.markAsSent();
        return invoiceRepository.save(invoice);
    }
}

