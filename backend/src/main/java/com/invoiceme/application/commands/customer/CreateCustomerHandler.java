package com.invoiceme.application.commands.customer;

import com.invoiceme.domain.customer.Customer;
import com.invoiceme.infrastructure.persistence.customer.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreateCustomerHandler {
    private final CustomerRepository customerRepository;

    public CreateCustomerHandler(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional
    public Customer handle(CreateCustomerCommand command) {
        if (customerRepository.existsByEmail(command.getEmail())) {
            throw new IllegalArgumentException("Customer with email " + command.getEmail() + " already exists");
        }
        Customer customer = Customer.create(
                command.getName(),
                command.getEmail(),
                command.getAddress(),
                command.getPhone()
        );
        return customerRepository.save(customer);
    }
}


