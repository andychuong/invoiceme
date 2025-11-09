package com.invoiceme.infrastructure.api.mapper;

import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.domain.invoice.InvoiceLineItem;
import com.invoiceme.infrastructure.api.dto.invoice.InvoiceRequestDTO;
import com.invoiceme.infrastructure.api.dto.invoice.InvoiceResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {})
public interface InvoiceMapper {
    @Mapping(target = "customerId", source = "customer.id")
    @Mapping(target = "customerName", source = "customer.name")
    @Mapping(target = "status", source = "status", defaultValue = "DRAFT")
    InvoiceResponseDTO toResponseDTO(Invoice invoice);
    
    List<InvoiceResponseDTO> toResponseDTOList(List<Invoice> invoices);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "invoiceNumber", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "balance", ignore = true)
    @Mapping(target = "lineItems", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "customer", ignore = true)
    Invoice toDomain(InvoiceRequestDTO dto);
    
    InvoiceResponseDTO.LineItemDTO toLineItemDTO(InvoiceLineItem lineItem);
    List<InvoiceResponseDTO.LineItemDTO> toLineItemDTOList(List<InvoiceLineItem> lineItems);
}

