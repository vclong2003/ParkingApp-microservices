package com.parknexus.PaymentService.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.parknexus.PaymentService.entity.PayoutRecord;

public interface IPayoutRecordRepository extends JpaRepository<PayoutRecord, Integer> {

}
