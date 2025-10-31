import { useState, useEffect } from "react";
import { fetchWeather } from "../api/services";

export function useWeather() {
    const [location, setLocation] = useState({
        name: "Ribeirão Preto, SP",
        lat: -21.1775,
        lon: -47.8103,
    });
    const [weather, setWeather] = useState({ loading: true, data: null });

    useEffect(() => {
        const loadWeatherData = async () => {
            if (!location.lat || !location.lon) return;
            setWeather({ loading: true, data: null });
            try {
                const rawData = await fetchWeather(location);

                const currentWeather = rawData.list[0];
                const next12Hours = rawData.list.slice(0, 4);
                const maxPop = Math.max(...next12Hours.map((item) => item.pop));

                const formattedData = {
                    temp: Math.round(currentWeather.main.temp),
                    description: currentWeather.weather[0].description,
                    icon: currentWeather.weather[0].icon,
                    chanceChuva: Math.round(maxPop * 100),
                    humidity: currentWeather.main.humidity,
                    windSpeed: Math.round(currentWeather.wind.speed * 3.6),
                    hourlyForecast: next12Hours.map((item) => ({
                        time: new Date(item.dt * 1000).toLocaleTimeString(
                            "pt-BR",
                            { hour: "2-digit", minute: "2-digit" }
                        ),
                        icon: item.weather[0].icon,
                        pop: Math.round(item.pop * 100),
                    })),
                };

                setWeather({ loading: false, data: formattedData });
            } catch (error) {
                console.error("Failed to fetch weather:", error);
                setWeather({ loading: false, data: null });
            }
        };
        loadWeatherData();
    }, [location]);

    return { location, setLocation, weather };
}