package com.irrigador.irrigador.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ModuleStatusUpdateDto {

    private Long id;
    private String status;
}
