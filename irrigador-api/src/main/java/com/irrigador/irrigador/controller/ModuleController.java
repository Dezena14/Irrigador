package com.irrigador.irrigador.controller;

import com.irrigador.irrigador.dto.ModuleDto;
import com.irrigador.irrigador.model.HumidityHistory;
import com.irrigador.irrigador.model.Module;
import com.irrigador.irrigador.service.ModuleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
@Tag(name = "modules", description = "Endpoints para gerenciamento dos módulos de irrigação")
public class ModuleController {

    private final ModuleService moduleService;

    @GetMapping
    @Operation(summary = "Lista todos os módulos", description = "Retorna uma lista com todos os módulos e seus estados atuais.")
    public List<Module> getAllModules(){
        return  moduleService.findAllModules();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Cria um novo módulo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Módulo criado com sucesso",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Module.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos", content = @Content)
    })
    public Module createModule (@RequestBody ModuleDto moduleDTO) {
        return moduleService.createModule(moduleDTO);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Atualiza parcialmente um módulo",
            description = "Use para renomear, mudar limiar ou ligar/desligar irrigação manual.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Módulo atualizado"),
            @ApiResponse(responseCode = "404", description = "Módulo não encontrado", content = @Content)
    })
    public Module patchModule(@PathVariable Long id, @RequestBody ModuleDto dto) {
        try {
            return moduleService.updateModulePartial(id, dto);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Módulo não encontrado", ex);
        }
    }

    @Operation(summary = "Busca o histórico de umidade de um módulo", description = "Retorna os registros de umidade para um módulo específico.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Histórico retornado com sucesso",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = HumidityHistory.class))),
            @ApiResponse(responseCode = "404", description = "Módulo não encontrado", content = @Content)
    })
    @GetMapping("/{id}/history")
    public List<HumidityHistory> getModuleHistory(@PathVariable Long id) {
        return moduleService.findHistoryByModuleId(id);
    }
}