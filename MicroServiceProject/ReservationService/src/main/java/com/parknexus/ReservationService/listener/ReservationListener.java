package com.parknexus.ReservationService.listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.parknexus.ReservationService.client.IParkingLotServiceClient;
import com.parknexus.ReservationService.dto.event.ReservationAutoCheckoutEvent;
import com.parknexus.ReservationService.entity.Reservation;
import com.parknexus.ReservationService.enums.ParkingSpotStatus;
import com.parknexus.ReservationService.enums.ReservationStatus;
import com.parknexus.ReservationService.repository.IReservationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReservationListener {
    private final IReservationRepository reservationRepository;
    private final IParkingLotServiceClient parkingLotServiceClient;

    @RabbitListener(queues = "${rabbitmq.queue.reservation.autoCheckOut}")
    public void handleReservationAutoCheckoutEvent(ReservationAutoCheckoutEvent event) {
        log.info("auto checkout", event.getReservationId());

        Reservation reservation = reservationRepository.findById(event.getReservationId())
                .orElse(null);

        if (reservation == null) {
            log.warn("reservation not found (auto check out)");
            return;
        }

        if (reservation.getStatus() == ReservationStatus.OnGoing) {
            reservation.setStatus(ReservationStatus.Completed);
            reservationRepository.save(reservation);
            parkingLotServiceClient.updateParkingSpotStatus(reservation.getParkingLotId(),
                    reservation.getParkingSpotId(), ParkingSpotStatus.Available);
            log.info("reservation auto checked out");
            return;
        }

        log.info("reservation not on going (auto check out)");
    }

}
