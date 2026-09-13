package com.parknexus.PaymentService.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.parknexus.PaymentService.entity.PaymentRecord;
import com.parknexus.PaymentService.repository.IPaymentRecordRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final IPaymentRecordRepository paymentRecordRepository;

    public List<PaymentRecord> getAllPaymentRecords() {
        return paymentRecordRepository.findAll();
    }
}
