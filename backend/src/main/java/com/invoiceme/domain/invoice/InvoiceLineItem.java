package com.invoiceme.domain.invoice;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "invoice_line_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceLineItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false, precision = 19, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        calculateAmount();
    }

    @PreUpdate
    protected void onUpdate() {
        calculateAmount();
    }

    private void calculateAmount() {
        if (quantity != null && unitPrice != null) {
            this.amount = unitPrice.multiply(BigDecimal.valueOf(quantity));
        }
    }

    public static InvoiceLineItem create(Invoice invoice, String description, Integer quantity, BigDecimal unitPrice) {
        InvoiceLineItem item = new InvoiceLineItem();
        item.setInvoice(invoice);
        item.setDescription(description);
        item.setQuantity(quantity);
        item.setUnitPrice(unitPrice);
        item.calculateAmount();
        return item;
    }

    public void update(String description, Integer quantity, BigDecimal unitPrice) {
        this.description = description;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        calculateAmount();
    }
}


