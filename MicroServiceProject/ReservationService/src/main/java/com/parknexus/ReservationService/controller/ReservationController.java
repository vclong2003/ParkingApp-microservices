package com.parknexus.ReservationService.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parknexus.Common.annotation.RequireRole;
import com.parknexus.Common.context.AccountContext;
import com.parknexus.Common.enums.AccountRole;
import com.parknexus.ReservationService.dto.AvailableSpotsAndTypesDto;
import com.parknexus.ReservationService.dto.CreateReservationResultDto;
import com.parknexus.ReservationService.dto.ReservationDto;
import com.parknexus.ReservationService.form.CheckInOutForm;
import com.parknexus.ReservationService.form.CreateReservationForm;
import com.parknexus.ReservationService.form.GetAvailableSpotsAndTypesForm;
import com.parknexus.ReservationService.form.GetReservationsForm;
import com.parknexus.ReservationService.service.ReservationService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController()
@RequestMapping("api/v1/reservations")
@CrossOrigin("*")
@AllArgsConstructor
public class ReservationController {
    private final ReservationService reservationService;

    @GetMapping("")
    public ResponseEntity<List<ReservationDto>> getReservations() {
        AccountContext accountContext = AccountContext.get();
        List<ReservationDto> reservations = reservationService
            .getReservations(new GetReservationsForm(accountContext.getUserId()));
        return ResponseEntity.ok(reservations);
    }

    @RequireRole({ AccountRole.User })
    @GetMapping("{id}")
    public ResponseEntity<ReservationDto> getReservation(@PathVariable Integer id) {
        AccountContext accountContext = AccountContext.get();
        ReservationDto reservation = reservationService.getReservation(accountContext.getUserId(), id);
        return ResponseEntity.ok(reservation);
    }

    @RequireRole({ AccountRole.User })
    @PostMapping("")
    public ResponseEntity<ReservationDto> createReservation(
            @RequestBody @Valid CreateReservationForm form) {
        AccountContext accountContext = AccountContext.get();
        CreateReservationResultDto result = reservationService.createReservation(accountContext.getUserId(), form);

        ReservationDto reservationDto = new ReservationDto(result.getReservation());
        reservationDto.setParkingLotDto(result.getParkingLotDto());
        reservationDto.setVehicleDto(result.getVehicleDto());
        reservationDto.setParkingSpotDto(result.getParkingSpotDto());

        return ResponseEntity.status(HttpStatus.CREATED).body(reservationDto);

    }

    @RequireRole({ AccountRole.User })
    @GetMapping("availability")
    public ResponseEntity<AvailableSpotsAndTypesDto> getAvailability(
            @ModelAttribute @Valid GetAvailableSpotsAndTypesForm form) {
        AvailableSpotsAndTypesDto availableSpotsAndTypes = reservationService.getAvailableSpotsAndTypes(form);
        return ResponseEntity.ok(availableSpotsAndTypes);
    }

    @RequireRole({ AccountRole.User })
    @PutMapping("{id}/cancel")
    public ResponseEntity<Void> cancelReservation(@PathVariable Integer id) {
        AccountContext accountContext = AccountContext.get();
        reservationService.cancelReservation(accountContext.getUserId(), id);
        return ResponseEntity.ok().build();
    }

    @RequireRole({ AccountRole.User })
    @PutMapping("{id}/check-in")
    public ResponseEntity<Void> checkInReservation(@PathVariable Integer id, @RequestBody @Valid CheckInOutForm form) {
        reservationService.checkIn(form);
        return ResponseEntity.ok().build();
    }

    @RequireRole({ AccountRole.User })
    @PutMapping("{id}/check-out")
    public ResponseEntity<Void> checkOutReservation(@PathVariable Integer id, @RequestBody @Valid CheckInOutForm form) {
        reservationService.checkOut(form);
        return ResponseEntity.ok().build();
    }
}
