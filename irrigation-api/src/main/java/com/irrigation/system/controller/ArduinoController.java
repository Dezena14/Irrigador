package com.irrigation.system.controller;

import com.irrigation.system.dto.ArduinoCommand;
import com.irrigation.system.service.ArduinoService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/arduino")
public class ArduinoController {
    private final ArduinoService arduinoService;

    public ArduinoController(ArduinoService arduinoService) {
        this.arduinoService = arduinoService;
    }

    @PostMapping("/command")
    public String sendCommand(@RequestBody ArduinoCommand command) {
        arduinoService.sendCommand(command.getCommand());
        return "Comando '" + command.getCommand() + " 'enviado";
    }
}
