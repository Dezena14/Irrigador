package com.irrigation.system.controller;

import com.irrigation.system.service.LedService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/led")
public class LedController {
    private final LedService ledService;

    public LedController(LedService ledService) {
        this.ledService = ledService;
    }

    @PostMapping("/on")
    public ResponseEntity<String> turnOn() {
        ledService.turnOn();
        return ResponseEntity.ok("LED ligado");
    }

    @PostMapping("/off")
    public ResponseEntity<String> turnOff() {
        ledService.turnOff();
        return ResponseEntity.ok("LED desligado");
    }
}
