package com.irrigation.system.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.fazecast.jSerialComm.SerialPort;

@Configuration
public class ArduinoConfig {
    @Value("${arduino.port}")
    private String arduinoPort;

    @Bean
    public SerialPort serialPort() {
        SerialPort port = SerialPort.getCommPort(arduinoPort);
        port.setBaudRate(9600);
        if (port.openPort()) {
            System.out.println("Arduino conectado na porta: " + arduinoPort);
            return port;
        }
        throw new RuntimeException("Falha ao conectar na porta: " + arduinoPort);
    }
}
