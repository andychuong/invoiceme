package com.invoiceme.infrastructure.api.dto.invoice;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceResponseDTO {
    private UUID id;
    private UUID customerId;
    private String customerName;
    private String invoiceNumber;
    private String status;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private BigDecimal totalAmount;
    private BigDecimal balance;
    private List<LineItemDTO> lineItems;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LineItemDTO {
        private UUID id;
        private String description;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal amount;
    }
}

