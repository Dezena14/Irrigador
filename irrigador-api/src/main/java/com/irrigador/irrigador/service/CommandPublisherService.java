package com.irrigador.irrigador.service;

import com.irrigador.irrigador.config.RabbitMQConfig;
import com.irrigador.irrigador.dto.CommandDto;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommandPublisherService {

    private final RabbitTemplate rabbitTemplate;

    public void sendManualIrrigationCommand(Long moduleId, String action) {
        CommandDto command = new CommandDto(moduleId, action);

        System.out.println(">>> Enviando comando para o RabbitMQ: " + command);

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE_NAME,
                RabbitMQConfig.COMMAND_ROUTING_KEY,
                command
        );
    }
}
