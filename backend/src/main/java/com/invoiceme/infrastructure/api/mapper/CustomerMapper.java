package com.invoiceme.infrastructure.api.mapper;

import com.invoiceme.domain.customer.Customer;
import com.invoiceme.infrastructure.api.dto.customer.CustomerRequestDTO;
import com.invoiceme.infrastructure.api.dto.customer.CustomerResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {})
public interface CustomerMapper {
    CustomerResponseDTO toResponseDTO(Customer customer);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Customer toDomain(CustomerRequestDTO dto);
}

