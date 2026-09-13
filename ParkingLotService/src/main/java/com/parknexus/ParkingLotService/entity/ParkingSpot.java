package com.parknexus.ParkingLotService.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.parknexus.ParkingLotService.enums.ParkingSpotStatus;
import com.parknexus.ParkingLotService.enums.VehicleType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class ParkingSpot implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JoinColumn(nullable = false)
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private ParkingLot parkingLot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleType vehicleType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParkingSpotStatus status = ParkingSpotStatus.Available;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column
    private LocalDateTime updatedAt;
}
