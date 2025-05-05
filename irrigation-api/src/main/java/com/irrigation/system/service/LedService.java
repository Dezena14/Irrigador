package com.irrigation.system.service;

import com.fazecast.jSerialComm.SerialPort;
import org.springframework.stereotype.Service;

@Service
public class LedService {
    private final SerialPort serialPort;

    public LedService(SerialPort serialPort) {
        this.serialPort = serialPort;
    }

    public void turnOn(){
        serialPort.writeBytes("LIGAR\n".getBytes(), "LIGAR\n".length());
    }

    public void turnOff(){
        serialPort.writeBytes("DESLIGAR\n".getBytes(), "DESLIGAR\n".length());
    }
}
