package com.irrigation.system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class IrrigationApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(IrrigationApiApplication.class, args);
		System.out.println("Porta configurada: " + System.getProperty("arduino.port"));
	}

}