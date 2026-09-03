package com.parknexus.ParkingLotService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ParkingLotServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ParkingLotServiceApplication.class, args);
	}

}
