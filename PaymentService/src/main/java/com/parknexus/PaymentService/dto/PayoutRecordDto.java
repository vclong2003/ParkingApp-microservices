package com.parknexus.PaymentService.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.parknexus.PaymentService.entity.PayoutRecord;
import com.parknexus.PaymentService.enums.PayoutErrorType;
import com.parknexus.PaymentService.enums.PayoutStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PayoutRecordDto {
    private Integer id;
    private Integer userId;
    private Integer transferId;
    private PayoutStatus status;
    private PayoutErrorType errorType;
    private BigDecimal amountInUsd;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PayoutRecordDto(PayoutRecord entity) {
        this.id = entity.getId();
        this.userId = entity.getUserId();
        this.transferId = entity.getTransferId();
        this.status = entity.getStatus();
        this.errorType = entity.getErrorType();
        this.amountInUsd = entity.getAmountInUsd();
        this.createdAt = entity.getCreatedAt();
        this.updatedAt = entity.getUpdatedAt();
    }
}
