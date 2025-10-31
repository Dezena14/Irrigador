package com.irrigador.irrigador.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommandDto {
    private Long moduleId;
    private String action;
}
