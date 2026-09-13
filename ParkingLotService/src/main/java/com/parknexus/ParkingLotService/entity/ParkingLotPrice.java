package com.parknexus.ParkingLotService.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.parknexus.ParkingLotService.enums.VehicleType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@NoArgsConstructor
@Getter
@Setter
@ToString
@IdClass(ParkingLotPriceId.class)
public class ParkingLotPrice implements Serializable {
    @Id
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleType vehicleType;

    @Id
    @ManyToOne
    @JoinColumn(nullable = false)
    @ToString.Exclude
    @JsonIgnore
    private ParkingLot parkingLot;

    @Column(nullable = false)
    private BigDecimal price;

    @UpdateTimestamp
    @Column
    private LocalDateTime updatedAt;

    @Column(nullable = true)
    private LocalDateTime deletedAt;

}
