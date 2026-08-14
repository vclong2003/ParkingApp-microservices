package com.parknexus.PaymentService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.parknexus.PaymentService.entity.PaymentRecord;

public interface IPaymentRecordRepository extends JpaRepository<PaymentRecord, Integer> {

}
