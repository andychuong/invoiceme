package com.invoiceme.application.commands.customer;

import com.invoiceme.domain.customer.Customer;
import com.invoiceme.infrastructure.persistence.customer.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class DeleteCustomerHandler {
    private final CustomerRepository customerRepository;

    public DeleteCustomerHandler(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional
    public void handle(DeleteCustomerCommand command) {
        Customer customer = customerRepository.findByIdAndCompanyId(command.getId(), command.getCompanyId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + command.getId()));
        customerRepository.delete(customer);
    }
}


