package com.irrigador.irrigador.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    @Value("${openweathermap.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public Integer getChanceOfRain(String lat, String lon) {
        if( lat == null || lon == null){
            System.err.println("Latitude ou Longitude nulas, não é possível buscar o tempo.");
            return null;
        }

        String url = String.format(
                "https://api.openweathermap.org/data/2.5/forecast?lat=%s&lon=%s&appid=%s&units=metric",
                lat,
                lon,
                apiKey
        );

        try {
            JsonNode root = restTemplate.getForObject(url, JsonNode.class);
            if(root != null) {
                double maxPop = 0;
                for(int i = 0; i<4; i++) {
                    double pop = root.path("list").path(i).path("pop").asDouble(0);
                    if(pop > maxPop) {
                        maxPop = pop;
                    }
                }
                return (int) Math.round(maxPop * 100);
            }
        } catch (Exception e) {
            System.err.println("Erro ao buscar previsão do tempo: " + e.getMessage());
            return null;
        }
        return  null;
    }
}
