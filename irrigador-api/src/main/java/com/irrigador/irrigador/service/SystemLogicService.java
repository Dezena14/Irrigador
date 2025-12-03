package com.irrigador.irrigador.service;

import com.irrigador.irrigador.dto.ModuleStatusUpdateDto;
import com.irrigador.irrigador.dto.SystemSettingsDto;
import com.irrigador.irrigador.model.Module;
import com.irrigador.irrigador.model.SystemSettings;
import com.irrigador.irrigador.repository.SystemSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SystemLogicService {

    private final ModuleService moduleService;
    private final WeatherService weatherService;
    private final SystemSettingsRepository settingsRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final CommandPublisherService commandPublisherService;

    private boolean isSystemActive = true;

    public boolean isSystemActive() {
        return isSystemActive;
    }

    public void toggleSystemStatus() {
        this.isSystemActive = !this.isSystemActive;
    }

    @Scheduled(initialDelay = 10000, fixedRate = 60000)
    public void updateModulesStatus() {
        System.out.println("[SystemLogicService] Verificando e atualizando status dos módulos...");

        SystemSettings settings = settingsRepository.findById(1L).orElse(null);
        if(settings == null) {
            System.err.println("Configurações do sistema não encontradas no banco!");
            return;
        }

        Integer chanceOfRain = weatherService.getChanceOfRain(settings.getLatitude(), settings.getLongitude());
        boolean isRainy = chanceOfRain != null && chanceOfRain > settings.getRainThreshold();

        List <Module> modules = moduleService.findAllModules();
        List <Module> modulesToUpdate = new ArrayList<>();
        List<ModuleStatusUpdateDto> statusUpdates = new ArrayList<>();

        for(Module module : modules) {
            String oldStatus = module.getStatus();
            String newStatus = determineModuleStatus(module, isRainy);

            if (!newStatus.equals(oldStatus)) {
                module.setStatus(newStatus);
                modulesToUpdate.add(module);
                statusUpdates.add(new ModuleStatusUpdateDto(module.getId(), newStatus));

                handleAutomaticCommand(module, oldStatus, newStatus);
            }
        }

        if (!modulesToUpdate.isEmpty()) {
            moduleService.saveAllModules(modulesToUpdate);
            System.out.println("[SystemLogicService] Status de " + modulesToUpdate.size() + " módulos foram atualizados.");

            statusUpdates.forEach(update -> {
                messagingTemplate.convertAndSend("/topic/module-update", update);
            });
        } else {
            System.out.println("[SystemLogicService] Nenhum status de módulo alterado.");
        }


    }

    private String determineModuleStatus(Module module, boolean isRainy) {

        if (!"offline".equals(module.getHardwareStatus()) && isSystemActive) {
            if ("on".equals(module.getManualOverride())) {
                return "manual_on";
            }
            if ("off".equals(module.getManualOverride())) {
                return "manual_off";
            }
            if (isRainy) {
                return "pausado";
            }
            if (module.getCurrentHumidity() < module.getHumidityThreshold()) {
                return "irrigando";
            }
            return "ok";
        } else {
            return "desligado";
        }
    }

    public SystemSettings getSystemSettings() {
        return settingsRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Configurações do sistema não encontradas"));
    }

    public SystemSettings updateSystemSettings(SystemSettingsDto settingsDto) {
        SystemSettings settings = getSystemSettings();

        settings.setLocationName(settingsDto.getLocationName());
        settings.setLatitude(settingsDto.getLatitude());
        settings.setLongitude(settingsDto.getLongitude());
        settings.setRainThreshold(settingsDto.getRainThreshold());

        return settingsRepository.save(settings);
    }

    public void handleAutomaticCommand(Module module, String oldStatus, String newStatus) {
        if (module.getManualOverride() != null) return;

        if ("irrigando".equals(newStatus)) {
            System.out.println(">>> [Auto] Ligando módulo " + module.getId());
            commandPublisherService.sendManualIrrigationCommand(module.getId(), "on");
        }
        else if ("irrigando".equals(oldStatus)) {
            System.out.println(">>> [Auto] Desligando módulo " + module.getId());
            commandPublisherService.sendManualIrrigationCommand(module.getId(), "off");
        }

        if ("desligado".equals(newStatus)) {
            commandPublisherService.sendManualIrrigationCommand(module.getId(), "off");
        }
    }
}