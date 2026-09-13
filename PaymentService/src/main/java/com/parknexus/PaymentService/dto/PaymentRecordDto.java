package com.parknexus.PaymentService.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.parknexus.PaymentService.entity.PaymentRecord;
import com.parknexus.PaymentService.enums.PaymentRecordStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRecordDto {
    private Integer id;
    private Integer userId;
    private Integer reservationId;
    private PaymentRecordStatus status;
    private BigDecimal amountInUsd;
    private String stripeIntentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PaymentRecordDto(PaymentRecord entity) {
        this.id = entity.getId();
        this.userId = entity.getUserId();
        this.reservationId = entity.getReservationId();
        this.status = entity.getStatus();
        this.amountInUsd = entity.getAmountInUsd();
        this.stripeIntentId = entity.getStripeIntentId();
        this.createdAt = entity.getCreatedAt();
        this.updatedAt = entity.getUpdatedAt();
    }
}
