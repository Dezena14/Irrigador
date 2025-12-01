package com.irrigador.irrigador.controller;

import com.irrigador.irrigador.dto.SystemSettingsDto;
import com.irrigador.irrigador.dto.SystemStatusResponse;
import com.irrigador.irrigador.model.SystemSettings;
import com.irrigador.irrigador.service.SystemLogicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/system")
@RequiredArgsConstructor
@Tag(name = "System", description = "Endpoints para o controle geral do sistema")
public class SystemController {

    private final SystemLogicService systemLogicService;

    @Operation(summary = "Verifica o status geral do sistema", description = "Retorna se o sistema de irrigação automático está 'Ativo' ou 'Inativo'.")
    @ApiResponse(responseCode = "200", description = "Status retornado com sucesso")
    @GetMapping("/status")
    public SystemStatusResponse getSystemStatus() {
        return new SystemStatusResponse(systemLogicService.isSystemActive());
    }

    @Operation(summary = "Ativa/Desativa o sistema geral", description = "Alterna o estado do sistema entre 'Ativo' e 'Inativo'.")
    @ApiResponse(responseCode = "200", description = "Status do sistema alterado com sucesso")
    @PatchMapping("/status")
    public SystemStatusResponse toggleSystemStatus() {
        systemLogicService.toggleSystemStatus();
        return new SystemStatusResponse(systemLogicService.isSystemActive());
    }

    @Operation(summary = "Busca as configurações do sistema")
    @ApiResponse(responseCode = "200", description = "Configurações retornadas com sucesso")
    @GetMapping("/settings")
    public SystemSettings getSettings() {
        return systemLogicService.getSystemSettings();
    }

    @Operation(summary = "Atualiza as configurações do sistema")
    @ApiResponse(responseCode = "200", description = "Configurações atualizadas com sucesso")
    @PutMapping("/settings")
    public SystemSettings updateSettings(@RequestBody SystemSettingsDto settingsDto) {
        return systemLogicService.updateSystemSettings(settingsDto);
    }
}
