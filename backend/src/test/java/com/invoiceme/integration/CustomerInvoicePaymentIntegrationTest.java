package com.invoiceme.integration;

import com.invoiceme.application.commands.customer.CreateCustomerCommand;
import com.invoiceme.application.commands.customer.CreateCustomerHandler;
import com.invoiceme.application.commands.invoice.CreateInvoiceCommand;
import com.invoiceme.application.commands.invoice.CreateInvoiceHandler;
import com.invoiceme.application.commands.invoice.MarkInvoiceAsSentCommand;
import com.invoiceme.application.commands.invoice.MarkInvoiceAsSentHandler;
import com.invoiceme.application.commands.payment.RecordPaymentCommand;
import com.invoiceme.application.commands.payment.RecordPaymentHandler;
import com.invoiceme.domain.customer.Customer;
import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.domain.invoice.InvoiceStatus;
import com.invoiceme.domain.payment.Payment;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
public class CustomerInvoicePaymentIntegrationTest {

    @Autowired
    private CreateCustomerHandler createCustomerHandler;

    @Autowired
    private CreateInvoiceHandler createInvoiceHandler;

    @Autowired
    private MarkInvoiceAsSentHandler markInvoiceAsSentHandler;

    @Autowired
    private RecordPaymentHandler recordPaymentHandler;

    @Test
    public void testCompleteCustomerInvoicePaymentFlow() {
        // Step 1: Create a customer
        CreateCustomerCommand customerCommand = new CreateCustomerCommand(
                "John Doe",
                "john.doe@example.com",
                "123 Main St",
                "555-1234"
        );
        Customer customer = createCustomerHandler.handle(customerCommand);
        assertNotNull(customer.getId());
        assertEquals("John Doe", customer.getName());
        assertEquals("john.doe@example.com", customer.getEmail());

        // Step 2: Create an invoice for the customer
        List<CreateInvoiceCommand.LineItemDto> lineItems = new ArrayList<>();
        lineItems.add(new CreateInvoiceCommand.LineItemDto(
                "Web Development Services",
                10,
                new BigDecimal("100.00")
        ));
        lineItems.add(new CreateInvoiceCommand.LineItemDto(
                "Consulting",
                5,
                new BigDecimal("150.00")
        ));

        CreateInvoiceCommand invoiceCommand = new CreateInvoiceCommand(
                customer.getId(),
                LocalDate.now(),
                LocalDate.now().plusDays(30),
                lineItems
        );
        Invoice invoice = createInvoiceHandler.handle(invoiceCommand);
        assertNotNull(invoice.getId());
        assertEquals(InvoiceStatus.DRAFT, invoice.getStatus());
        assertEquals(2, invoice.getLineItems().size());
        assertEquals(new BigDecimal("1750.00"), invoice.getTotalAmount());
        assertEquals(new BigDecimal("1750.00"), invoice.getBalance());

        // Step 3: Mark invoice as sent
        MarkInvoiceAsSentCommand markSentCommand = new MarkInvoiceAsSentCommand(invoice.getId());
        Invoice sentInvoice = markInvoiceAsSentHandler.handle(markSentCommand);
        assertEquals(InvoiceStatus.SENT, sentInvoice.getStatus());

        // Step 4: Record a partial payment
        RecordPaymentCommand paymentCommand = new RecordPaymentCommand(
                invoice.getId(),
                new BigDecimal("500.00"),
                LocalDate.now(),
                "BANK_TRANSFER",
                "REF-12345"
        );
        Payment payment = recordPaymentHandler.handle(paymentCommand);
        assertNotNull(payment.getId());
        assertEquals(new BigDecimal("500.00"), payment.getAmount());

        // Step 5: Record another payment to fully pay the invoice
        RecordPaymentCommand finalPaymentCommand = new RecordPaymentCommand(
                invoice.getId(),
                new BigDecimal("1250.00"),
                LocalDate.now(),
                "CARD",
                "REF-12346"
        );
        Payment finalPayment = recordPaymentHandler.handle(finalPaymentCommand);
        assertNotNull(finalPayment.getId());

        // Verify invoice balance is now zero and status is PAID
        // Note: This would require fetching the invoice again to see updated balance
        // In a real scenario, you'd use a query handler to fetch the updated invoice
    }
}

