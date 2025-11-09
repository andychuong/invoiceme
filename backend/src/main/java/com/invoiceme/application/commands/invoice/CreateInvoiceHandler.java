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
                command.getDueDate(),
                customer.getCompany()  // Use the company from the customer
        );

        // First save the invoice without line items
        Invoice savedInvoice = invoiceRepository.save(invoice);

        // Then add line items and save again to ensure proper calculation
        if (command.getLineItems() != null && !command.getLineItems().isEmpty()) {
            for (CreateInvoiceCommand.LineItemDto itemDto : command.getLineItems()) {
                InvoiceLineItem lineItem = InvoiceLineItem.create(
                        savedInvoice,
                        itemDto.getDescription(),
                        itemDto.getQuantity(),
                        itemDto.getUnitPrice()
                );
                savedInvoice.addLineItem(lineItem);
            }
            // Save again with line items to persist the calculated total
            savedInvoice = invoiceRepository.save(savedInvoice);
        }

        return savedInvoice;
    }

    private String generateInvoiceNumber() {
        String prefix = "INV-";
        String timestamp = String.valueOf(System.currentTimeMillis());
        String random = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return prefix + timestamp.substring(timestamp.length() - 8) + "-" + random;
    }
}

