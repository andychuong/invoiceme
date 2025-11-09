package com.invoiceme.infrastructure.api.controller;

import com.invoiceme.application.commands.customer.*;
import com.invoiceme.application.queries.customer.*;
import com.invoiceme.domain.customer.Customer;
import com.invoiceme.infrastructure.api.dto.common.ErrorResponseDTO;
import com.invoiceme.infrastructure.api.dto.common.PageResponseDTO;
import com.invoiceme.infrastructure.api.dto.customer.CustomerRequestDTO;
import com.invoiceme.infrastructure.api.dto.customer.CustomerResponseDTO;
import com.invoiceme.infrastructure.api.mapper.CustomerMapper;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class CustomerController {
    private final CreateCustomerHandler createCustomerHandler;
    private final UpdateCustomerHandler updateCustomerHandler;
    private final DeleteCustomerHandler deleteCustomerHandler;
    private final GetCustomerByIdHandler getCustomerByIdHandler;
    private final ListAllCustomersHandler listAllCustomersHandler;
    private final CustomerMapper customerMapper;

    public CustomerController(
            CreateCustomerHandler createCustomerHandler,
            UpdateCustomerHandler updateCustomerHandler,
            DeleteCustomerHandler deleteCustomerHandler,
            GetCustomerByIdHandler getCustomerByIdHandler,
            ListAllCustomersHandler listAllCustomersHandler,
            CustomerMapper customerMapper) {
        this.createCustomerHandler = createCustomerHandler;
        this.updateCustomerHandler = updateCustomerHandler;
        this.deleteCustomerHandler = deleteCustomerHandler;
        this.getCustomerByIdHandler = getCustomerByIdHandler;
        this.listAllCustomersHandler = listAllCustomersHandler;
        this.customerMapper = customerMapper;
    }

    @PostMapping
    public ResponseEntity<CustomerResponseDTO> createCustomer(@Valid @RequestBody CustomerRequestDTO request) {
        CreateCustomerCommand command = new CreateCustomerCommand(
                request.getName(),
                request.getEmail(),
                request.getAddress(),
                request.getPhone()
        );
        Customer customer = createCustomerHandler.handle(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(customerMapper.toResponseDTO(customer));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> updateCustomer(
            @PathVariable UUID id,
            @Valid @RequestBody CustomerRequestDTO request) {
        UpdateCustomerCommand command = new UpdateCustomerCommand(
                id,
                request.getName(),
                request.getEmail(),
                request.getAddress(),
                request.getPhone()
        );
        Customer customer = updateCustomerHandler.handle(command);
        return ResponseEntity.ok(customerMapper.toResponseDTO(customer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable UUID id) {
        DeleteCustomerCommand command = new DeleteCustomerCommand(id);
        deleteCustomerHandler.handle(command);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> getCustomerById(@PathVariable UUID id) {
        GetCustomerByIdQuery query = new GetCustomerByIdQuery(id);
        Customer customer = getCustomerByIdHandler.handle(query);
        return ResponseEntity.ok(customerMapper.toResponseDTO(customer));
    }

    @GetMapping
    public ResponseEntity<PageResponseDTO<CustomerResponseDTO>> listAllCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sort) {
        Pageable pageable;
        if (sort != null && !sort.isEmpty()) {
            String[] sortParams = sort.split(",");
            Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("desc")
                    ? Sort.Direction.DESC : Sort.Direction.ASC;
            String sortField = sortParams[0];
            // Validate sort field to prevent SQL injection
            if (!isValidSortField(sortField)) {
                sortField = "name"; // Default to name if invalid
            }
            pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        } else {
            pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "name"));
        }
        
        ListAllCustomersQuery query = new ListAllCustomersQuery(pageable);
        Page<Customer> customerPage = listAllCustomersHandler.handle(query);
        
        PageResponseDTO<CustomerResponseDTO> response = new PageResponseDTO<>();
        response.setContent(customerPage.getContent().stream()
                .map(customerMapper::toResponseDTO)
                .toList());
        response.setPage(customerPage.getNumber());
        response.setSize(customerPage.getSize());
        response.setTotalElements(customerPage.getTotalElements());
        response.setTotalPages(customerPage.getTotalPages());
        response.setFirst(customerPage.isFirst());
        response.setLast(customerPage.isLast());
        
        return ResponseEntity.ok(response);
    }
    
    private boolean isValidSortField(String field) {
        return field != null && (field.equals("name") || field.equals("email") 
                || field.equals("createdAt") || field.equals("updatedAt"));
    }
}

