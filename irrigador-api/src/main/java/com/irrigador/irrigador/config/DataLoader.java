package com.irrigador.irrigador.config;

import com.irrigador.irrigador.model.Module;
import com.irrigador.irrigador.model.SystemSettings;
import com.irrigador.irrigador.repository.ModuleRepository;
import com.irrigador.irrigador.repository.SystemSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final ModuleRepository moduleRepository;
    private final SystemSettingsRepository settingsRepository;

    @Override
    public void run(String... args) throws Exception {
        if (moduleRepository.count() == 0) {
            Module tomateiro = new Module();
            tomateiro.setName("Tomateiro");
            tomateiro.setHumidityThreshold(50);
            tomateiro.setCurrentHumidity(65);
            tomateiro.setWaterConsumed(12.5);
            tomateiro.setIrrigationCount(5);
            tomateiro.setHardwareStatus("online");
            tomateiro.setStatus("ok");
            tomateiro.setManualOverride(null);

            Module hortela = new Module();
            hortela.setName("Hortelã");
            hortela.setHumidityThreshold(55);
            hortela.setCurrentHumidity(70);
            hortela.setWaterConsumed(25.2);
            hortela.setIrrigationCount(12);
            hortela.setHardwareStatus("online");
            hortela.setStatus("ok");
            hortela.setManualOverride(null);

            moduleRepository.saveAll(List.of(tomateiro, hortela));

            System.out.println("Dados iniciais carregados no banco de dados");
        }

        if (settingsRepository.count() == 0) {
            SystemSettings settings = new SystemSettings();

            settings.setId(1L);
            settings.setLocationName("Bonfim Paulista, SP");
            settings.setLatitude("-21.264");
            settings.setLongitude("-47.8169");
            settings.setRainThreshold(90);
            settingsRepository.save(settings);

            System.out.println("Configurações iniciais so sistema carregadas");
        }
    }
}
