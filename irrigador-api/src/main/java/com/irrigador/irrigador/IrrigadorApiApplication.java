package com.irrigador.irrigador;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class IrrigadorApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(IrrigadorApiApplication.class, args);
	}

}
