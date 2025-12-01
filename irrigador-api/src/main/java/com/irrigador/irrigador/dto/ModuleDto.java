package com.irrigador.irrigador.dto;

import lombok.Data;

@Data
public class ModuleDto {
    private String name;
    private Integer humidityThreshold;
    private String manualOverride;
}
