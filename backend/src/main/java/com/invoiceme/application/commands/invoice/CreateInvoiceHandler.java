package com.invoiceme.application.commands.invoice;

import com.invoiceme.domain.customer.Customer;
import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.domain.invoice.InvoiceLineItem;
import com.invoiceme.infrastructure.persistence.customer.CustomerRepository;
import com.invoiceme.infrastructure.persistence.invoice.InvoiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class CreateInvoiceHandler {
    private final InvoiceRepository invoiceRepository;
    private final CustomerRepository customerRepository;

    public CreateInvoiceHandler(InvoiceRepository invoiceRepository, CustomerRepository customerRepository) {
        this.invoiceRepository = invoiceRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional
    public Invoice handle(CreateInvoiceCommand command) {
        Customer customer = customerRepository.findById(command.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + command.getCustomerId()));

        String invoiceNumber = generateInvoiceNumber();
        Invoice invoice = Invoice.create(
                customer,
                invoiceNumber,
                command.getIssueDate(),
                command.getDueDate()
        );

        if (command.getLineItems() != null && !command.getLineItems().isEmpty()) {
            command.getLineItems().forEach(itemDto -> {
                InvoiceLineItem lineItem = InvoiceLineItem.create(
                        invoice,
                        itemDto.getDescription(),
                        itemDto.getQuantity(),
                        itemDto.getUnitPrice()
                );
                invoice.addLineItem(lineItem);
            });
        }

        return invoiceRepository.save(invoice);
    }

    private String generateInvoiceNumber() {
        String prefix = "INV-";
        String timestamp = String.valueOf(System.currentTimeMillis());
        String random = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return prefix + timestamp.substring(timestamp.length() - 8) + "-" + random;
    }
}

