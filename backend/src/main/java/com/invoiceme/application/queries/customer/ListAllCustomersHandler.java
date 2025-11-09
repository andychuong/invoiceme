package com.invoiceme.application.queries.customer;

import com.invoiceme.domain.customer.Customer;
import com.invoiceme.infrastructure.persistence.customer.CustomerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ListAllCustomersHandler {
    private final CustomerRepository customerRepository;

    public ListAllCustomersHandler(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public Page<Customer> handle(ListAllCustomersQuery query) {
        return customerRepository.findByCompanyId(query.getCompanyId(), query.getPageable());
    }
}

