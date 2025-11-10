package com.invoiceme.application.commands.invoice;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MarkInvoiceAsSentCommand {
    private UUID companyId;
    private UUID id;
}

