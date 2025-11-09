package com.invoiceme.application.commands.customer;

import com.invoiceme.domain.customer.Customer;
import com.invoiceme.infrastructure.persistence.customer.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UpdateCustomerHandler {
    private final CustomerRepository customerRepository;

    public UpdateCustomerHandler(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional
    public Customer handle(UpdateCustomerCommand command) {
        Customer customer = customerRepository.findById(command.getId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + command.getId()));
        
        // Check if email is being changed and if new email already exists
        if (!customer.getEmail().equals(command.getEmail()) && 
            customerRepository.existsByEmail(command.getEmail())) {
            throw new IllegalArgumentException("Customer with email " + command.getEmail() + " already exists");
        }
        
        customer.update(
                command.getName(),
                command.getEmail(),
                command.getAddress(),
                command.getPhone()
        );
        return customerRepository.save(customer);
    }
}


