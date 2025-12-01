package com.irrigador.irrigador.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemSettingsDto {

    private String locationName;
    private String latitude;
    private String longitude;
    private Integer rainThreshold;
}
