package com.invoiceme.application.commands.invoice;

import com.invoiceme.domain.customer.Customer;
import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.domain.invoice.InvoiceLineItem;
import com.invoiceme.infrastructure.persistence.customer.CustomerRepository;
import com.invoiceme.infrastructure.persistence.invoice.InvoiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class UpdateInvoiceHandler {
    private final InvoiceRepository invoiceRepository;
    private final CustomerRepository customerRepository;

    public UpdateInvoiceHandler(InvoiceRepository invoiceRepository, CustomerRepository customerRepository) {
        this.invoiceRepository = invoiceRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional
    public Invoice handle(UpdateInvoiceCommand command) {
        Invoice invoice = invoiceRepository.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found with id: " + command.getId()));

        Customer customer = customerRepository.findById(command.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + command.getCustomerId()));

        invoice.update(customer, command.getIssueDate(), command.getDueDate());

        if (command.getLineItems() != null) {
            List<InvoiceLineItem> newLineItems = new ArrayList<>();
            command.getLineItems().forEach(itemDto -> {
                InvoiceLineItem lineItem = InvoiceLineItem.create(
                        invoice,
                        itemDto.getDescription(),
                        itemDto.getQuantity(),
                        itemDto.getUnitPrice()
                );
                newLineItems.add(lineItem);
            });
            invoice.updateLineItems(newLineItems);
        }

        return invoiceRepository.save(invoice);
    }
}

