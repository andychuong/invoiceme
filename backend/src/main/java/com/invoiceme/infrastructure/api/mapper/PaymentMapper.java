package com.invoiceme.infrastructure.api.mapper;

import com.invoiceme.domain.payment.Payment;
import com.invoiceme.infrastructure.api.dto.payment.PaymentRequestDTO;
import com.invoiceme.infrastructure.api.dto.payment.PaymentResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {})
public interface PaymentMapper {
    @Mapping(target = "invoiceId", source = "invoice.id")
    PaymentResponseDTO toResponseDTO(Payment payment);
    
    List<PaymentResponseDTO> toResponseDTOList(List<Payment> payments);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "invoice", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Payment toDomain(PaymentRequestDTO dto);
}

