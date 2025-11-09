package com.invoiceme.application.queries.customer;

import com.invoiceme.domain.customer.Customer;
import com.invoiceme.infrastructure.persistence.customer.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class GetCustomerByIdHandler {
    private final CustomerRepository customerRepository;

    public GetCustomerByIdHandler(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public Customer handle(GetCustomerByIdQuery query) {
        return customerRepository.findById(query.getId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + query.getId()));
    }
}

