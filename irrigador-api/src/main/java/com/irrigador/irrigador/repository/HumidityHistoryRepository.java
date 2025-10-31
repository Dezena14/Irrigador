package com.irrigador.irrigador.repository;

import com.irrigador.irrigador.model.HumidityHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HumidityHistoryRepository extends JpaRepository<HumidityHistory, Long> {
    List <HumidityHistory> findByModuleIdOrderByTimestampDesc(Long moduleId);
}
