package com.parknexus.ApiGateway.dto;

import com.parknexus.ApiGateway.enums.AccountRole;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TokenPayloadDto {
    private String accountId;
    private AccountRole role;
}
