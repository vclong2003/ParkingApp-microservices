package com.parknexus.PaymentService.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.parknexus.PaymentService.entity.PayoutRecord;
import com.parknexus.PaymentService.repository.IPayoutRecordRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PayoutService {
    private final IPayoutRecordRepository payoutRecordRepository;

    public List<PayoutRecord> getAllPayoutRecords() {
        return payoutRecordRepository.findAll();
    }
}
