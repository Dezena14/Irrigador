package com.irrigador.irrigador.controller;

import com.irrigador.irrigador.dto.ModuleDto;
import com.irrigador.irrigador.model.HumidityHistory;
import com.irrigador.irrigador.model.Module;
import com.irrigador.irrigador.service.CommandPublisherService;
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

import java.util.List;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
@Tag(name = "modules", description = "Endpoints para gerenciamento dos módulos de irrigação")
public class ModuleController {

    private final ModuleService moduleService;
    private final CommandPublisherService commandPublisherService;

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
            @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos")
    })
    public Module createModule (@RequestBody ModuleDto moduleDTO) {
        return moduleService.createModule(moduleDTO);
    }

    @Operation(summary = "Atualiza um módulo existente", description = "Atualiza o nome e/ou o limiar de umidade de um módulo.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Módulo atualizado com sucesso",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Module.class))),
            @ApiResponse(responseCode = "404", description = "Módulo não encontrado", content = @Content),
            @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos", content = @Content)
    })
    @PutMapping("/{id}")
    public Module updateModule (@PathVariable Long id, @RequestBody ModuleDto moduleDTO) {
        return moduleService.updateModule(id, moduleDTO);
    }

    @Operation(summary = "Busca o histórico de umidade de um módulo", description = "Retorna os últimos 30 registros de umidade para um módulo específico.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Histórico retornado com sucesso",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = HumidityHistory.class))),
            @ApiResponse(responseCode = "404", description = "Módulo não encontrado", content = @Content)
    })
    @GetMapping("/{id}/history")
    public List<HumidityHistory> getModuleHistory(@PathVariable Long id) {
        return moduleService.findHistoryByModuleId(id);
    }

    @Operation(summary = "Ativa/Desativa a irrigação manual", description = "Alterna o modo de override manual (de 'null' para 'on' e vice-versa) e envia o comando para o RabbitMQ.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comando manual enviado e módulo atualizado",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Module.class))),
            @ApiResponse(responseCode = "404", description = "Módulo não encontrado", content = @Content)
    })
    @PostMapping("/{id}/manual-override")
    public Module toggleManualOverride(@PathVariable Long id) {
        Module updateModule = moduleService.toggleManualOverride(id);

        String action = "on".equals(updateModule.getManualOverride()) ? "on" : "off";
        commandPublisherService.sendManualIrrigationCommand(id, action);

        return updateModule;
    }
}
