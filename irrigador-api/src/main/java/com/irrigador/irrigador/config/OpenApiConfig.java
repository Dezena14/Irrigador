package com.irrigador.irrigador.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Irrigador API")
                        .version("0.1")
                        .description("API para o Sistema de Irrigação Inteligente. Gerencia módulos, histórico de umidade e controle remoto.")
                );
    }
}