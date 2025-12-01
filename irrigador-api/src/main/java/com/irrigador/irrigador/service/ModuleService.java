package com.irrigador.irrigador.service;

import com.irrigador.irrigador.dto.ModuleDto;
import com.irrigador.irrigador.model.HumidityHistory;
import com.irrigador.irrigador.model.Module;
import com.irrigador.irrigador.repository.HumidityHistoryRepository;
import com.irrigador.irrigador.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final HumidityHistoryRepository historyRepository;
    private final CommandPublisherService commandPublisherService;

    public List<Module> findAllModules() {
        return moduleRepository.findAll();
    }

    public Module createModule(ModuleDto moduleDTO){
        Module newModule = new Module();

        newModule.setName(moduleDTO.getName());
        newModule.setHumidityThreshold(moduleDTO.getHumidityThreshold());
        newModule.setCurrentHumidity(50);

        return moduleRepository.save(newModule);
    }

    public Module updateModule(Long id, ModuleDto moduleDTO){
        return moduleRepository.findById(id)
                .map(existingModule -> {
                    existingModule.setName(moduleDTO.getName());
                    existingModule.setHumidityThreshold(moduleDTO.getHumidityThreshold());

                    return moduleRepository.save(existingModule);
                })
                .orElseThrow( () -> new RuntimeException("Módulo não encontrado com id: "+ id));
    }

    public Module updateModuleHumidity(Long id, int humidity) {
        return moduleRepository.findById(id)
                .map(module -> {
                    module.setCurrentHumidity(humidity);
                    moduleRepository.save(module);

                    HumidityHistory historyEntry = new HumidityHistory(humidity, module);
                    historyRepository.save(historyEntry);

                    System.out.println("Umidade do Módulo " + id + " atualizada e histórico salvo.");
                    return module;
                })
                .orElse(null);
    }

    public void saveAllModules(List<Module> modules) {
        moduleRepository.saveAll(modules);
    }

    public List<HumidityHistory> findHistoryByModuleId(Long moduleId) {
        return historyRepository.findByModuleIdOrderByTimestampDesc(moduleId);
    }

    @Transactional
    public Module toggleManualOverride(Long id) {
        return moduleRepository.findById(id)
                .map(module -> {
                    if("on".equals(module.getManualOverride())) {
                        module.setManualOverride(null);
                    } else {
                        module.setManualOverride("on");
                    }
                    Module updatedModule = moduleRepository.save(module);
                    String action = "on".equals(updatedModule.getManualOverride()) ? "on" : "off";
                    commandPublisherService.sendManualIrrigationCommand(updatedModule.getId(), action);
                    return updatedModule;
                })
                .orElseThrow(() -> new RuntimeException("Módulo não encontrado com id: " + id));
    }

    public Module updateModulePartial(Long id, ModuleDto dto) {
        return moduleRepository.findById(id)
                .map(module -> {
                    boolean stateChanged = false;

                    if (dto.getName() != null) {
                        module.setName(dto.getName());
                    }

                    if (dto.getHumidityThreshold() != null) {
                        module.setHumidityThreshold(dto.getHumidityThreshold());
                    }

                    if (dto.getManualOverride() != null) {
                        String newState = "off".equalsIgnoreCase(dto.getManualOverride()) ? null : "on";
                        module.setManualOverride(newState);

                        String mqttCommand = (newState == null) ? "off" : "on";
                        commandPublisherService.sendManualIrrigationCommand(module.getId(), mqttCommand);

                        stateChanged = true;
                    }

                    return moduleRepository.save(module);
                })
                .orElseThrow(() -> new RuntimeException("Módulo não encontrado com id: " + id));
    }
}
