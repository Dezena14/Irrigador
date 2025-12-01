import { useState, useEffect } from "react";
import {
    getSystemSettings,
    updateSystemSettings,
    getCoordsFromCityName,
} from "../api/services";

export function useSystemSettings(addNotification) {
    const [location, setLocation] = useState({
        name: "Carregando...",
        lat: 0,
        lon: 0,
    });
    const [rainThreshold, setRainThreshold] = useState(40);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [inputCity, setInputCity] = useState("");
    const [inputThreshold, setInputThreshold] = useState("");

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const settings = await getSystemSettings();
                setLocation({
                    name: settings.locationName,
                    lat: settings.latitude,
                    lon: settings.longitude,
                });
                setRainThreshold(settings.rainThreshold);
                setInputCity(settings.locationName);
                setInputThreshold(settings.rainThreshold.toString());
            } catch (error) {
                console.error("Falha ao carregar configurações:", error);
                addNotification(
                    "Não foi possível carregar as configurações do sistema.",
                    true
                );
            }
        };
        loadSettings();
    }, [addNotification]);

    const handleSave = async () => {
        setIsLoading(true);
        let newLocation = location;
        const newThreshold = parseInt(inputThreshold, 10);

        if (isNaN(newThreshold) || newThreshold < 0 || newThreshold > 100) {
            addNotification("Limiar de chuva inválido.", true);
            setIsLoading(false);
            return;
        }

        try {
            if (inputCity.trim() !== location.name) {
                const coords = await getCoordsFromCityName(inputCity);
                if (!coords) {
                    addNotification(
                        "Cidade não encontrada. Tente novamente.",
                        true
                    );
                    setInputCity(location.name);
                    setIsLoading(false);
                    return;
                }
                newLocation = coords;
            }

            const settingsData = {
                locationName: newLocation.name,
                latitude: newLocation.lat,
                longitude: newLocation.lon,
                rainThreshold: newThreshold,
            };

            await updateSystemSettings(settingsData);

            setLocation(newLocation);
            setRainThreshold(newThreshold);

            addNotification("Configurações salvas com sucesso!");
            setIsEditing(false);
        } catch (error) {
            console.error("Falha ao salvar configurações:", error);
            addNotification("Erro ao salvar configurações.", true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setInputCity(location.name);
        setInputThreshold(rainThreshold.toString());
        setIsEditing(false);
    };

    return {
        location,
        rainThreshold,
        isEditing,
        setIsEditing,
        isLoading,
        inputCity,
        setInputCity,
        inputThreshold,
        setInputThreshold,
        handleSave,
        handleCancel,
    };
}
