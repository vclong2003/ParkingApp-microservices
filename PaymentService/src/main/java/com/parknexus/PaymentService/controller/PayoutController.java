package com.parknexus.PaymentService.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parknexus.PaymentService.dto.PayoutRecordDto;
import com.parknexus.PaymentService.entity.PayoutRecord;
import com.parknexus.PaymentService.service.PayoutService;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("api/v1/payouts")
@CrossOrigin("*")
@AllArgsConstructor
public class PayoutController {
    private final PayoutService payoutService;

    @GetMapping()
    public ResponseEntity<List<PayoutRecordDto>> getAllPayoutRecords() {
        List<PayoutRecord> records = payoutService.getAllPayoutRecords();
        List<PayoutRecordDto> recordDtos = records.stream().map(record -> new PayoutRecordDto(record)).toList();

        return new ResponseEntity<>(recordDtos, HttpStatus.OK);
    }

}
