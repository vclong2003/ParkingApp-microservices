package com.parknexus.PaymentService.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.parknexus.PaymentService.enums.PaymentRecordStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
public class PaymentRecord implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Integer userId;

    @Column(nullable = false)
    private Integer reservationId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentRecordStatus status = PaymentRecordStatus.Awaiting;

    @Column(nullable = false)
    private BigDecimal amountInUsd;

    @Column(nullable = false)
    private String stripeIntentId;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column
    private LocalDateTime updatedAt;
}
