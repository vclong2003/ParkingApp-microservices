package com.parknexus.ParkingLotService.config;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.parknexus.ParkingLotService.entity.ParkingLot;
import com.parknexus.ParkingLotService.entity.ParkingLotAddon;
import com.parknexus.ParkingLotService.entity.ParkingLotPrice;
import com.parknexus.ParkingLotService.entity.ParkingSpot;
import com.parknexus.ParkingLotService.enums.ParkingLotStatus;
import com.parknexus.ParkingLotService.enums.VehicleType;
import com.parknexus.ParkingLotService.repository.IParkingLotRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class ParkingLotDataSeeder {
        // private final IParkingLotRepository parkingLotRepository;

        // @Override
        // public void run(String... args) throws Exception {
        // if (parkingLotRepository.count() == 0) {
        // log.info("Seeding mock parking lots with prices, spots, and add-ons...");

        // // --- Parking Lot 1 ---
        // ParkingLot lot1 = new ParkingLot();
        // lot1.setDescription("Central Plaza Underground Parking");
        // lot1.setLatitude(21.028511);
        // lot1.setLongitude(105.804817);
        // lot1.setMediaUrls(List.of(
        // "https://picsum.photos/id/1018/800/600",
        // "https://picsum.photos/id/1020/800/600"));
        // lot1.setOpenAt(LocalTime.of(6, 0));
        // lot1.setCloseAt(LocalTime.of(23, 0));
        // lot1.setStatus(ParkingLotStatus.Active);
        // lot1.setIsApproved(true);
        // lot1.setApprovedAt(LocalDateTime.now().minusDays(10));

        // // Prices
        // ParkingLotPrice price1a = createPrice(VehicleType.Car, new
        // BigDecimal("2.50"), lot1);
        // ParkingLotPrice price1b = createPrice(VehicleType.Motorcycle, new
        // BigDecimal("1.00"), lot1);
        // lot1.getPrices().addAll(List.of(price1a, price1b));

        // // Spots
        // ParkingSpot spot1a = createSpot(VehicleType.Car, lot1);
        // ParkingSpot spot1b = createSpot(VehicleType.Car, lot1);
        // ParkingSpot spot1c = createSpot(VehicleType.Motorcycle, lot1);
        // lot1.getSpots().addAll(List.of(spot1a, spot1b, spot1c));

        // // Add-ons
        // ParkingLotAddon addon1a = createAddon(
        // "Exterior Car Wash",
        // "Full exterior water wash and hand dry",
        // VehicleType.Car,
        // new BigDecimal("15.00"),
        // List.of("https://picsum.photos/id/1071/800/600"),
        // lot1);
        // ParkingLotAddon addon1b = createAddon(
        // "Helmet Storage",
        // "Secure locker for 1 motorcycle helmet",
        // VehicleType.Motorcycle,
        // new BigDecimal("1.00"),
        // List.of(),
        // lot1);
        // lot1.getAddons().addAll(List.of(addon1a, addon1b));

        // // --- Parking Lot 2 ---
        // ParkingLot lot2 = new ParkingLot();
        // lot2.setDescription("Vincom Center Multi-Level Garage");
        // lot2.setLatitude(10.776889);
        // lot2.setLongitude(106.700806);
        // lot2.setMediaUrls(List.of(
        // "https://picsum.photos/id/1035/800/600"));
        // lot2.setOpenAt(LocalTime.of(0, 0));
        // lot2.setCloseAt(LocalTime.of(23, 59)); // 24/7
        // lot2.setStatus(ParkingLotStatus.Active);
        // lot2.setIsApproved(true);
        // lot2.setApprovedAt(LocalDateTime.now().minusDays(5));

        // // Prices
        // ParkingLotPrice price2a = createPrice(VehicleType.Car, new
        // BigDecimal("3.00"), lot2);
        // ParkingLotPrice price2b = createPrice(VehicleType.Motorcycle, new
        // BigDecimal("1.50"), lot2);
        // ParkingLotPrice price2c = createPrice(VehicleType.Truck, new
        // BigDecimal("6.00"), lot2);
        // lot2.getPrices().addAll(List.of(price2a, price2b, price2c));

        // // Spots
        // ParkingSpot spot2a = createSpot(VehicleType.Car, lot2);
        // ParkingSpot spot2b = createSpot(VehicleType.Car, lot2);
        // ParkingSpot spot2c = createSpot(VehicleType.Motorcycle, lot2);
        // ParkingSpot spot2d = createSpot(VehicleType.Truck, lot2);
        // lot2.getSpots().addAll(List.of(spot2a, spot2b, spot2c, spot2d));

        // // Add-ons
        // ParkingLotAddon addon2a = createAddon(
        // "EV Fast Charging",
        // "Up to 50kW DC fast charging session",
        // VehicleType.Car,
        // new BigDecimal("10.00"),
        // List.of("https://picsum.photos/id/1084/800/600"),
        // lot2);
        // ParkingLotAddon addon2b = createAddon(
        // "Valet Parking Service",
        // "Drop off your vehicle at the main entrance",
        // VehicleType.Car,
        // new BigDecimal("20.00"),
        // List.of(),
        // lot2);
        // lot2.getAddons().addAll(List.of(addon2a, addon2b));

        // // --- Parking Lot 3 (Pending Approval) ---
        // ParkingLot lot3 = new ParkingLot();
        // lot3.setDescription("West Lake Outdoor Parking Spot");
        // lot3.setLatitude(21.058312);
        // lot3.setLongitude(105.823412);
        // lot3.setMediaUrls(List.of(
        // "https://picsum.photos/id/1040/800/600"));
        // lot3.setOpenAt(LocalTime.of(7, 30));
        // lot3.setCloseAt(LocalTime.of(21, 30));
        // lot3.setStatus(ParkingLotStatus.Inactive);
        // lot3.setIsApproved(false);
        // lot3.setApprovedAt(null);

        // // Prices
        // ParkingLotPrice price3a = createPrice(VehicleType.Car, new
        // BigDecimal("2.00"), lot3);
        // ParkingLotPrice price3b = createPrice(VehicleType.Motorcycle, new
        // BigDecimal("0.80"), lot3);
        // lot3.getPrices().addAll(List.of(price3a, price3b));

        // // Spots
        // ParkingSpot spot3a = createSpot(VehicleType.Car, lot3);
        // ParkingSpot spot3b = createSpot(VehicleType.Motorcycle, lot3);
        // lot3.getSpots().addAll(List.of(spot3a, spot3b));

        // // Add-ons
        // ParkingLotAddon addon3a = createAddon(
        // "Tire Inflation & Check",
        // "Check pressure and inflate all 4 tires",
        // VehicleType.Car,
        // new BigDecimal("3.00"),
        // List.of(),
        // lot3);
        // lot3.getAddons().add(addon3a);

        // // Save all lots (CascadeType.ALL saves prices, spots, and addons)
        // parkingLotRepository.saveAll(List.of(lot1, lot2, lot3));
        // log.info("Mock parking lots, prices, spots, and add-ons successfully
        // seeded.");
        // }
        // }

        // private ParkingLotPrice createPrice(VehicleType vehicleType, BigDecimal
        // price, ParkingLot parkingLot) {
        // ParkingLotPrice parkingLotPrice = new ParkingLotPrice();
        // parkingLotPrice.setVehicleType(vehicleType);
        // parkingLotPrice.setPrice(price);
        // parkingLotPrice.setParkingLot(parkingLot);
        // return parkingLotPrice;
        // }

        // private ParkingSpot createSpot(VehicleType vehicleType, ParkingLot
        // parkingLot) {
        // ParkingSpot spot = new ParkingSpot();
        // spot.setVehicleType(vehicleType);
        // spot.setParkingLot(parkingLot);
        // return spot;
        // }

        // private ParkingLotAddon createAddon(
        // String name,
        // String description,
        // VehicleType vehicleType,
        // BigDecimal price,
        // List<String> mediaUrls,
        // ParkingLot parkingLot) {
        // ParkingLotAddon addon = new ParkingLotAddon();
        // addon.setName(name);
        // addon.setDescription(description);
        // addon.setVehicleType(vehicleType);
        // addon.setPrice(price);
        // addon.setMediaUrls(mediaUrls);
        // addon.setParkingLot(parkingLot);
        // return addon;
        // }
}
