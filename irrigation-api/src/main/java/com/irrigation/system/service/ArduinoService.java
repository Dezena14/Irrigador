package com.irrigation.system.service;

import com.fazecast.jSerialComm.SerialPort;
import org.springframework.stereotype.Service;

@Service
public class ArduinoService {
    private final SerialPort serialPort;

    public ArduinoService(SerialPort serialPort) {
        this.serialPort = serialPort;
    }

    public void sendCommand (String command) {
        if (serialPort.isOpen()) {
            serialPort.writeBytes(command.getBytes(), command.length());
        }
    }
}
