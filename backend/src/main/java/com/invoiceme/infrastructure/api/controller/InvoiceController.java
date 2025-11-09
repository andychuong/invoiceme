package com.invoiceme.infrastructure.api.controller;

import com.invoiceme.application.commands.invoice.*;
import com.invoiceme.application.queries.invoice.*;
import com.invoiceme.domain.invoice.Invoice;
import com.invoiceme.domain.invoice.InvoiceLineItem;
import com.invoiceme.infrastructure.api.dto.common.PageResponseDTO;
import com.invoiceme.infrastructure.api.dto.invoice.InvoiceRequestDTO;
import com.invoiceme.infrastructure.api.dto.invoice.InvoiceResponseDTO;
import com.invoiceme.infrastructure.api.mapper.InvoiceMapper;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class InvoiceController {
    private final CreateInvoiceHandler createInvoiceHandler;
    private final UpdateInvoiceHandler updateInvoiceHandler;
    private final MarkInvoiceAsSentHandler markInvoiceAsSentHandler;
    private final GetInvoiceByIdHandler getInvoiceByIdHandler;
    private final ListAllInvoicesHandler listAllInvoicesHandler;
    private final ListInvoicesByStatusHandler listInvoicesByStatusHandler;
    private final ListInvoicesByCustomerHandler listInvoicesByCustomerHandler;
    private final InvoiceMapper invoiceMapper;

    public InvoiceController(
            CreateInvoiceHandler createInvoiceHandler,
            UpdateInvoiceHandler updateInvoiceHandler,
            MarkInvoiceAsSentHandler markInvoiceAsSentHandler,
            GetInvoiceByIdHandler getInvoiceByIdHandler,
            ListAllInvoicesHandler listAllInvoicesHandler,
            ListInvoicesByStatusHandler listInvoicesByStatusHandler,
            ListInvoicesByCustomerHandler listInvoicesByCustomerHandler,
            InvoiceMapper invoiceMapper) {
        this.createInvoiceHandler = createInvoiceHandler;
        this.updateInvoiceHandler = updateInvoiceHandler;
        this.markInvoiceAsSentHandler = markInvoiceAsSentHandler;
        this.getInvoiceByIdHandler = getInvoiceByIdHandler;
        this.listAllInvoicesHandler = listAllInvoicesHandler;
        this.listInvoicesByStatusHandler = listInvoicesByStatusHandler;
        this.listInvoicesByCustomerHandler = listInvoicesByCustomerHandler;
        this.invoiceMapper = invoiceMapper;
    }

    @PostMapping
    public ResponseEntity<InvoiceResponseDTO> createInvoice(@Valid @RequestBody InvoiceRequestDTO request) {
        CreateInvoiceCommand command = new CreateInvoiceCommand();
        command.setCustomerId(request.getCustomerId());
        command.setIssueDate(request.getIssueDate());
        command.setDueDate(request.getDueDate());
        command.setLineItems(request.getLineItems().stream()
                .map(item -> new CreateInvoiceCommand.LineItemDto(
                        item.getDescription(),
                        item.getQuantity(),
                        item.getUnitPrice()))
                .collect(Collectors.toList()));

        Invoice invoice = createInvoiceHandler.handle(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(invoice));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvoiceResponseDTO> updateInvoice(
            @PathVariable UUID id,
            @Valid @RequestBody InvoiceRequestDTO request) {
        UpdateInvoiceCommand command = new UpdateInvoiceCommand();
        command.setId(id);
        command.setCustomerId(request.getCustomerId());
        command.setIssueDate(request.getIssueDate());
        command.setDueDate(request.getDueDate());
        command.setLineItems(request.getLineItems().stream()
                .map(item -> new UpdateInvoiceCommand.LineItemDto(
                        item.getDescription(),
                        item.getQuantity(),
                        item.getUnitPrice()))
                .collect(Collectors.toList()));

        Invoice invoice = updateInvoiceHandler.handle(command);
        return ResponseEntity.ok(toResponseDTO(invoice));
    }

    @PatchMapping("/{id}/mark-sent")
    public ResponseEntity<InvoiceResponseDTO> markInvoiceAsSent(@PathVariable UUID id) {
        MarkInvoiceAsSentCommand command = new MarkInvoiceAsSentCommand(id);
        Invoice invoice = markInvoiceAsSentHandler.handle(command);
        return ResponseEntity.ok(toResponseDTO(invoice));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponseDTO> getInvoiceById(@PathVariable UUID id) {
        GetInvoiceByIdQuery query = new GetInvoiceByIdQuery(id);
        Invoice invoice = getInvoiceByIdHandler.handle(query);
        return ResponseEntity.ok(toResponseDTO(invoice));
    }

    @GetMapping
    public ResponseEntity<PageResponseDTO<InvoiceResponseDTO>> listInvoices(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {
        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("desc")
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortParams[0]));

        Page<Invoice> invoicePage;
        if (status != null && !status.isEmpty()) {
            ListInvoicesByStatusQuery query = new ListInvoicesByStatusQuery(status, pageable);
            invoicePage = listInvoicesByStatusHandler.handle(query);
        } else {
            ListAllInvoicesQuery query = new ListAllInvoicesQuery(pageable);
            invoicePage = listAllInvoicesHandler.handle(query);
        }

        PageResponseDTO<InvoiceResponseDTO> response = new PageResponseDTO<>();
        response.setContent(invoicePage.getContent().stream()
                .map(this::toResponseDTO)
                .toList());
        response.setPage(invoicePage.getNumber());
        response.setSize(invoicePage.getSize());
        response.setTotalElements(invoicePage.getTotalElements());
        response.setTotalPages(invoicePage.getTotalPages());
        response.setFirst(invoicePage.isFirst());
        response.setLast(invoicePage.isLast());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/customers/{customerId}")
    public ResponseEntity<PageResponseDTO<InvoiceResponseDTO>> listInvoicesByCustomer(
            @PathVariable UUID customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {
        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("desc")
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortParams[0]));

        ListInvoicesByCustomerQuery query = new ListInvoicesByCustomerQuery(customerId, pageable);
        Page<Invoice> invoicePage = listInvoicesByCustomerHandler.handle(query);

        PageResponseDTO<InvoiceResponseDTO> response = new PageResponseDTO<>();
        response.setContent(invoicePage.getContent().stream()
                .map(this::toResponseDTO)
                .toList());
        response.setPage(invoicePage.getNumber());
        response.setSize(invoicePage.getSize());
        response.setTotalElements(invoicePage.getTotalElements());
        response.setTotalPages(invoicePage.getTotalPages());
        response.setFirst(invoicePage.isFirst());
        response.setLast(invoicePage.isLast());

        return ResponseEntity.ok(response);
    }

    private InvoiceResponseDTO toResponseDTO(Invoice invoice) {
        InvoiceResponseDTO dto = invoiceMapper.toResponseDTO(invoice);
        if (invoice.getLineItems() != null) {
            dto.setLineItems(invoice.getLineItems().stream()
                    .map(invoiceMapper::toLineItemDTO)
                    .toList());
        }
        return dto;
    }
}

