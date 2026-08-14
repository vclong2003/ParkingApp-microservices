package com.parknexus.VehicleService.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.parknexus.VehicleService.entity.Vehicle;
import com.parknexus.VehicleService.enums.VehicleType;
import com.parknexus.VehicleService.repository.IVehicleRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class VehicleDataSeeder implements CommandLineRunner {
    private final IVehicleRepository vehicleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (vehicleRepository.count() == 0) {
            log.info("Seeding mock vehicles ...");

            Vehicle v1 = new Vehicle();
            v1.setType(VehicleType.Car);
            v1.setPlate("30A-12345");
            v1.setBrand("Toyota");
            v1.setModel("Camry");
            v1.setColor("Black");
            v1.setImageUrl("https://picsum.photos/800");
            v1.setOwnerId(1);

            Vehicle v2 = new Vehicle();
            v2.setType(VehicleType.Motorcycle);
            v2.setPlate("29B-88888");
            v2.setBrand("Honda");
            v2.setModel("SH 150i");
            v2.setColor("White");
            v2.setImageUrl("https://picsum.photos/800");
            v2.setOwnerId(1);

            Vehicle v3 = new Vehicle();
            v3.setType(VehicleType.Truck);
            v3.setPlate("51C-99999");
            v3.setBrand("Ford");
            v3.setModel("Ranger");
            v3.setColor("Red");
            v3.setImageUrl("https://picsum.photos/800");
            v3.setOwnerId(2);

            Vehicle v4 = new Vehicle();
            v4.setType(VehicleType.Car);
            v4.setPlate("43A-55555");
            v4.setBrand("Mazda");
            v4.setModel("CX-5");
            v4.setColor("Blue");
            v4.setImageUrl("https://picsum.photos/800");
            v4.setOwnerId(2);

            Vehicle v5 = new Vehicle();
            v5.setType(VehicleType.Motorcycle);
            v5.setPlate("59F-66666");
            v5.setBrand("Yamaha");
            v5.setModel("Exciter 155");
            v5.setColor("Blue");
            v5.setImageUrl("https://picsum.photos/800");
            v5.setOwnerId(3);

            Vehicle v6 = new Vehicle();
            v6.setType(VehicleType.Car);
            v6.setPlate("30H-77777");
            v6.setBrand("Mercedes-Benz");
            v6.setModel("E300 AMG");
            v6.setColor("Silver");
            v6.setImageUrl("https://picsum.photos/800");
            v6.setOwnerId(3);

            vehicleRepository.saveAll(List.of(v1, v2, v3, v4, v5, v6));
        }
    }
}
