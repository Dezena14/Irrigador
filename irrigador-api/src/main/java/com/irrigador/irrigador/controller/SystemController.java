package com.irrigador.irrigador.controller;

import com.irrigador.irrigador.service.SystemLogicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public Map<String, Boolean> getSystemStatus() {
        return Map.of("isActive", systemLogicService.isSystemActive());
    }

    @Operation(summary = "Ativa/Desativa o sistema geral", description = "Alterna o estado do sistema entre 'Ativo' e 'Inativo'.")
    @ApiResponse(responseCode = "200", description = "Status do sistema alterado com sucesso")
    @PostMapping("/toggle")
    public Map<String, Boolean> toggleSystemStatus() {
        systemLogicService.toggleSystemStatus();
        return getSystemStatus();
    }
}
