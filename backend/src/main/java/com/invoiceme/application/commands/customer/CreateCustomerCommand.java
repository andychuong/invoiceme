package com.invoiceme.application.commands.customer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateCustomerCommand {
    private String name;
    private String email;
    private String address;
    private String phone;
}


