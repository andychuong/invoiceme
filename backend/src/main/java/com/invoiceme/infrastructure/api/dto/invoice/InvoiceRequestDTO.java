package com.invoiceme.infrastructure.api.dto.invoice;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
public class InvoiceRequestDTO {
    @NotNull(message = "Customer ID is required")
    private UUID customerId;

    @NotNull(message = "Issue date is required")
    private LocalDate issueDate;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    @Valid
    @NotEmpty(message = "At least one line item is required")
    private List<LineItemDTO> lineItems;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LineItemDTO {
        @NotNull(message = "Description is required")
        private String description;

        @NotNull(message = "Quantity is required")
        private Integer quantity;

        @NotNull(message = "Unit price is required")
        private BigDecimal unitPrice;
    }
}

