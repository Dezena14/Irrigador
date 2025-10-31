package com.irrigador.irrigador.repository;

import com.irrigador.irrigador.model.SystemSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SystemSettingsRepository extends JpaRepository<SystemSettings, Long> {
}