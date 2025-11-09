package com.invoiceme.domain.invoice;

import com.invoiceme.domain.company.Company;
import com.invoiceme.domain.customer.Customer;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "invoice_number", nullable = false, unique = true)
    private String invoiceNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvoiceStatus status;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "total_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal balance;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<InvoiceLineItem> lineItems = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = InvoiceStatus.DRAFT;
        }
        if (balance == null) {
            balance = BigDecimal.ZERO;
        }
        if (totalAmount == null) {
            totalAmount = BigDecimal.ZERO;
        }
        validate();
        // Don't recalculate here - it's done in addLineItem() and will be preserved
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        validate();
        calculateTotalAmount();
    }

    private void validate() {
        if (customer == null) {
            throw new IllegalArgumentException("Invoice must have a customer");
        }
        if (invoiceNumber == null || invoiceNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Invoice number cannot be null or empty");
        }
        if (issueDate == null) {
            throw new IllegalArgumentException("Issue date cannot be null");
        }
        if (dueDate == null) {
            throw new IllegalArgumentException("Due date cannot be null");
        }
        if (dueDate.isBefore(issueDate)) {
            throw new IllegalArgumentException("Due date cannot be before issue date");
        }
    }

    private void calculateTotalAmount() {
        if (lineItems != null && !lineItems.isEmpty()) {
            this.totalAmount = lineItems.stream()
                    .map(InvoiceLineItem::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            // Balance should equal total amount for new invoices (before any payments)
            // Only preserve existing balance if it's been explicitly set by payment processing
            this.balance = this.totalAmount;
        } else {
            this.totalAmount = BigDecimal.ZERO;
            this.balance = BigDecimal.ZERO;
        }
    }

    public void calculateBalance(BigDecimal totalPayments) {
        this.balance = this.totalAmount.subtract(totalPayments);
        if (this.balance.compareTo(BigDecimal.ZERO) <= 0) {
            this.balance = BigDecimal.ZERO;
            if (this.status == InvoiceStatus.SENT) {
                this.status = InvoiceStatus.PAID;
            }
        }
    }

    public static Invoice create(Customer customer, String invoiceNumber, LocalDate issueDate, LocalDate dueDate, Company company) {
        Invoice invoice = new Invoice();
        invoice.setCustomer(customer);
        invoice.setInvoiceNumber(invoiceNumber);
        invoice.setIssueDate(issueDate);
        invoice.setDueDate(dueDate);
        invoice.setCompany(company);
        invoice.setStatus(InvoiceStatus.DRAFT);
        invoice.setTotalAmount(BigDecimal.ZERO);
        invoice.setBalance(BigDecimal.ZERO);
        return invoice;
    }

    public void addLineItem(InvoiceLineItem lineItem) {
        if (status != InvoiceStatus.DRAFT) {
            throw new IllegalStateException("Cannot add line items to invoice with status: " + status);
        }
        lineItem.setInvoice(this);
        this.lineItems.add(lineItem);
        calculateTotalAmount();
    }

    public void removeLineItem(InvoiceLineItem lineItem) {
        if (status != InvoiceStatus.DRAFT) {
            throw new IllegalStateException("Cannot remove line items from invoice with status: " + status);
        }
        this.lineItems.remove(lineItem);
        lineItem.setInvoice(null);
        calculateTotalAmount();
    }

    public void updateLineItems(List<InvoiceLineItem> newLineItems) {
        if (status != InvoiceStatus.DRAFT) {
            throw new IllegalStateException("Cannot update line items for invoice with status: " + status);
        }
        this.lineItems.clear();
        newLineItems.forEach(item -> {
            item.setInvoice(this);
            this.lineItems.add(item);
        });
        calculateTotalAmount();
    }

    public void markAsSent() {
        if (status != InvoiceStatus.DRAFT) {
            throw new IllegalStateException("Only draft invoices can be marked as sent");
        }
        if (lineItems == null || lineItems.isEmpty()) {
            throw new IllegalStateException("Cannot send invoice without line items");
        }
        this.status = InvoiceStatus.SENT;
    }

    public void update(Customer customer, LocalDate issueDate, LocalDate dueDate) {
        if (status != InvoiceStatus.DRAFT) {
            throw new IllegalStateException("Cannot update invoice with status: " + status);
        }
        this.customer = customer;
        this.issueDate = issueDate;
        this.dueDate = dueDate;
    }
}


