package com.parknexus.PaymentService.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parknexus.PaymentService.dto.PaymentRecordDto;
import com.parknexus.PaymentService.entity.PaymentRecord;
import com.parknexus.PaymentService.service.PaymentService;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("api/v1/payments")
@CrossOrigin("*")
@AllArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @GetMapping()
    public ResponseEntity<List<PaymentRecordDto>> getAllPaymentRecords() {
        List<PaymentRecord> records = paymentService.getAllPaymentRecords();
        List<PaymentRecordDto> recordDtos = records.stream().map(record -> new PaymentRecordDto(record)).toList();

        return new ResponseEntity<>(recordDtos, HttpStatus.OK);
    }

}
