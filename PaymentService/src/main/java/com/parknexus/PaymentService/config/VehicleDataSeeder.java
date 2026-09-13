package com.parknexus.PaymentService.config;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.parknexus.PaymentService.entity.PaymentRecord;
import com.parknexus.PaymentService.entity.PayoutRecord;
import com.parknexus.PaymentService.enums.PaymentRecordStatus;
import com.parknexus.PaymentService.enums.PayoutErrorType;
import com.parknexus.PaymentService.enums.PayoutStatus;
import com.parknexus.PaymentService.repository.IPaymentRecordRepository;
import com.parknexus.PaymentService.repository.IPayoutRecordRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class VehicleDataSeeder implements CommandLineRunner {
    private final IPaymentRecordRepository paymentRecordRepository;
    private final IPayoutRecordRepository payoutRecordRepository;

    @Override
    public void run(String... args) throws Exception {
        if (paymentRecordRepository.count() == 0 && payoutRecordRepository.count() == 0) {
            log.info("Seeding mock payment records and payout records...");

            // Payment 1: Successfully Paid
            PaymentRecord pay1 = new PaymentRecord();
            pay1.setUserId(1);
            pay1.setReservationId(1);
            pay1.setAmountInUsd(new BigDecimal("25.00"));
            pay1.setStripeIntentId("pi_3MtwBwLkdIwHu7ix28a3tY1A");
            pay1.setStatus(PaymentRecordStatus.Paid);

            // Payment 2: Awaiting Payment
            PaymentRecord pay2 = new PaymentRecord();
            pay2.setUserId(2);
            pay2.setReservationId(2);
            pay2.setAmountInUsd(new BigDecimal("18.50"));
            pay2.setStripeIntentId("pi_3MtwBwLkdIwHu7ix28a3tY2B");
            pay2.setStatus(PaymentRecordStatus.Awaiting);

            // Payment 3: Refunded
            PaymentRecord pay3 = new PaymentRecord();
            pay3.setUserId(3);
            pay3.setReservationId(5);
            pay3.setAmountInUsd(new BigDecimal("12.00"));
            pay3.setStripeIntentId("pi_3MtwBwLkdIwHu7ix28a3tY3C");
            pay3.setStatus(PaymentRecordStatus.Refunded);

            // Payment 4: Cancelled
            PaymentRecord pay4 = new PaymentRecord();
            pay4.setUserId(1);
            pay4.setReservationId(6);
            pay4.setAmountInUsd(new BigDecimal("10.00"));
            pay4.setStripeIntentId("pi_3MtwBwLkdIwHu7ix28a3tY4D");
            pay4.setStatus(PaymentRecordStatus.Cancelled);

            paymentRecordRepository.saveAll(List.of(pay1, pay2, pay3, pay4));
            log.info("Mock payment records seeded.");

            // ==========================================
            // 2. PAYOUT RECORDS (Outbound Owner Disbursals)
            // ==========================================

            // Payout 1: Successfully Completed
            PayoutRecord po1 = new PayoutRecord();
            po1.setUserId(2); // Parking Lot Owner ID
            po1.setTransferId(101);
            po1.setAmountInUsd(new BigDecimal("150.00"));
            po1.setStatus(PayoutStatus.Completed);
            po1.setErrorType(null);

            // Payout 2: Pending
            PayoutRecord po2 = new PayoutRecord();
            po2.setUserId(2);
            po2.setTransferId(102);
            po2.setAmountInUsd(new BigDecimal("85.50"));
            po2.setStatus(PayoutStatus.Pending);
            po2.setErrorType(null);

            // Payout 3: Failed (No Stripe Account)
            PayoutRecord po3 = new PayoutRecord();
            po3.setUserId(3);
            po3.setTransferId(103);
            po3.setAmountInUsd(new BigDecimal("210.00"));
            po3.setStatus(PayoutStatus.Failed);
            po3.setErrorType(PayoutErrorType.NoStripeAccount);

            // Payout 4: Failed (Insufficient Balance)
            PayoutRecord po4 = new PayoutRecord();
            po4.setUserId(4);
            po4.setTransferId(104);
            po4.setAmountInUsd(new BigDecimal("500.00"));
            po4.setStatus(PayoutStatus.Failed);
            po4.setErrorType(PayoutErrorType.InsufficientBalance);

            payoutRecordRepository.saveAll(List.of(po1, po2, po3, po4));
            log.info("Mock payout records seeded.");
        }
    }
}
