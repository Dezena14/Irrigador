package com.irrigador.irrigador.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class SystemSettings {

    @Id
    private Long id;

    private String locationName;
    private String latitude;
    private String longitude;
}
