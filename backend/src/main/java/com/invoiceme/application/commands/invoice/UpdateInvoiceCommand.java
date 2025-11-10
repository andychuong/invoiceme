package com.invoiceme.application.commands.invoice;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateInvoiceCommand {
    private UUID companyId;
    private UUID id;
    private UUID customerId;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private List<LineItemDto> lineItems;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LineItemDto {
        private String description;
        private Integer quantity;
        private BigDecimal unitPrice;
    }
}

