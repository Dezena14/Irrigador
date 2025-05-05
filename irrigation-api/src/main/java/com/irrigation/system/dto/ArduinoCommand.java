package com.irrigation.system.dto;

import lombok.Data;

@Data
public class ArduinoCommand {
    private String command; // on ou off
    private Integer pin; // pino do arduino
}
