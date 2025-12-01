package com.irrigador.irrigador.service;

import com.irrigador.irrigador.dto.ModuleStatusUpdateDto;
import com.irrigador.irrigador.dto.SensorDataDto;
import com.irrigador.irrigador.model.Module;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SensorDataListener {

    private final ModuleService moduleService;
    private final SimpMessagingTemplate messagingTemplate;

    @RabbitListener(queues = "sensor.data.queue")
    public void handleSensorData(SensorDataDto data) {
        System.out.println(">>> Mensagem recebida do RabbitMQ: " + data);

        if (data.getModuleId() == null) {
            System.out.println("Erro: Mensagem com Id de modulo nulo");
            return;
        }

        Module updatedModule = moduleService.updateModuleHumidity(data.getModuleId(), data.getHumidity());

        if (updatedModule != null) {
            messagingTemplate.convertAndSend("/topic/module-update",
                    new ModuleStatusUpdateDto(updatedModule.getId(), updatedModule.getStatus())
            );
            messagingTemplate.convertAndSend("/topic/humidity-update", data);
        }
    }
}
