package com.irrigador.irrigador.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Module {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int currentHumidity;
    private int humidityThreshold;
    private double waterConsumed;
    private int irrigationCount;
    private String hardwareStatus;
    private String status;
    private String manualOverride;

    @OneToMany(
            mappedBy = "module",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnore
    private List <HumidityHistory> history = new ArrayList<>();
}
