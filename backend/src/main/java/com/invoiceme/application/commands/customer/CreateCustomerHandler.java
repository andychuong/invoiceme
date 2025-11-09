package com.invoiceme.application.commands.customer;

import com.invoiceme.domain.company.Company;
import com.invoiceme.domain.customer.Customer;
import com.invoiceme.infrastructure.persistence.CompanyRepository;
import com.invoiceme.infrastructure.persistence.customer.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreateCustomerHandler {
    private final CustomerRepository customerRepository;
    private final CompanyRepository companyRepository;

    public CreateCustomerHandler(CustomerRepository customerRepository, CompanyRepository companyRepository) {
        this.customerRepository = customerRepository;
        this.companyRepository = companyRepository;
    }

    @Transactional
    public Customer handle(CreateCustomerCommand command) {
        if (customerRepository.existsByEmail(command.getEmail())) {
            throw new IllegalArgumentException("Customer with email " + command.getEmail() + " already exists");
        }
        
        Company company = companyRepository.findById(command.getCompanyId())
                .orElseThrow(() -> new IllegalArgumentException("Company not found with id: " + command.getCompanyId()));
        
        Customer customer = Customer.create(
                command.getName(),
                command.getEmail(),
                command.getAddress(),
                command.getPhone(),
                company
        );
        return customerRepository.save(customer);
    }
}


