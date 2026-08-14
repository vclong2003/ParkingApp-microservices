package com.parknexus.ReservationService.config;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.parknexus.ReservationService.entity.Reservation;
import com.parknexus.ReservationService.entity.ReservationAddon;
import com.parknexus.ReservationService.enums.ReservationStatus;
import com.parknexus.ReservationService.repository.IReservationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReservationDataSeeder implements CommandLineRunner {
    private final IReservationRepository reservationRepository;

    @Override
    public void run(String... args) throws Exception {
        if (reservationRepository.count() == 0) {
            log.info("Seeding mock reservations with addons...");

            // 1. Pending (Upcoming reservation)
            Reservation res1 = new Reservation();
            res1.setParkingSpotId(1);
            res1.setVehicleId(1);
            res1.setUserId(1);
            res1.setStartTime(LocalDateTime.now().plusDays(1).withHour(10).withMinute(0));
            res1.setEndTime(LocalDateTime.now().plusDays(1).withHour(18).withMinute(0));
            res1.setTotalPrice(new BigDecimal("20.00"));
            res1.setStatus(ReservationStatus.Pending);

            ReservationAddon addon1a = createAddon(1, res1);
            res1.getReservationAddons().add(addon1a);

            // 2. OnGoing (Currently parked)
            Reservation res2 = new Reservation();
            res2.setParkingSpotId(2);
            res2.setVehicleId(2);
            res2.setUserId(2);
            res2.setStartTime(LocalDateTime.now().minusHours(1));
            res2.setEndTime(LocalDateTime.now().plusHours(3));
            res2.setTotalPrice(new BigDecimal("18.50"));
            res2.setStatus(ReservationStatus.OnGoing);

            ReservationAddon addon2a = createAddon(1, res2);
            ReservationAddon addon2b = createAddon(2, res2);
            res2.getReservationAddons().addAll(List.of(addon2a, addon2b));

            // 3. Completed (Finished successfully in the past)
            Reservation res3 = new Reservation();
            res3.setParkingSpotId(3);
            res3.setVehicleId(3);
            res3.setUserId(1);
            res3.setStartTime(LocalDateTime.now().minusDays(2).withHour(8).withMinute(0));
            res3.setEndTime(LocalDateTime.now().minusDays(2).withHour(12).withMinute(0));
            res3.setTotalPrice(new BigDecimal("25.00"));
            res3.setStatus(ReservationStatus.Completed);

            ReservationAddon addon3a = createAddon(3, res3);
            res3.getReservationAddons().add(addon3a);

            // 4. Overstayed (End time passed, but vehicle hasn't checked out)
            Reservation res4 = new Reservation();
            res4.setParkingSpotId(4);
            res4.setVehicleId(4);
            res4.setUserId(3);
            res4.setStartTime(LocalDateTime.now().minusHours(5));
            res4.setEndTime(LocalDateTime.now().minusHours(1)); // Should have left 1 hr ago
            res4.setTotalPrice(new BigDecimal("30.00"));
            res4.setStatus(ReservationStatus.Overstayed);

            // 5. Expired (Pending status, but user never showed up past the start time)
            Reservation res5 = new Reservation();
            res5.setParkingSpotId(1);
            res5.setVehicleId(5);
            res5.setUserId(2);
            res5.setStartTime(LocalDateTime.now().minusHours(3));
            res5.setEndTime(LocalDateTime.now().minusHours(1));
            res5.setTotalPrice(new BigDecimal("12.00"));
            res5.setStatus(ReservationStatus.Expired);

            // 6. Cancelled (User manually cancelled before start time)
            Reservation res6 = new Reservation();
            res6.setParkingSpotId(2);
            res6.setVehicleId(6);
            res6.setUserId(3);
            res6.setStartTime(LocalDateTime.now().plusDays(3).withHour(14).withMinute(0));
            res6.setEndTime(LocalDateTime.now().plusDays(3).withHour(16).withMinute(0));
            res6.setTotalPrice(new BigDecimal("10.00"));
            res6.setStatus(ReservationStatus.Cancelled);

            // Save all (CascadeType.ALL persists addons automatically)
            reservationRepository.saveAll(List.of(res1, res2, res3, res4, res5, res6));
            log.info("Mock reservations successfully seeded.");
        }
    }

    private ReservationAddon createAddon(Integer addonId, Reservation reservation) {
        ReservationAddon addon = new ReservationAddon();
        addon.setAddonId(addonId);
        addon.setReservation(reservation);
        return addon;
    }

}
