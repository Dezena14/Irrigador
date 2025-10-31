import { useState, useEffect } from "react";
import {
    fetchModules,
    getSystemStatus,
    toggleSystemStatus,
} from "../api/services";

export function useIrrigationSystem(weather, addNotification) {
    const [modules, setModules] = useState([]);
    const [isSystemActive, setIsSystemActive] = useState(true);

    useEffect(() => {
        fetchModules()
            .then((data) => {
                setModules(data);
            })
            .catch((err) => {
                console.error("Falha ao buscar módulos:", err);
                addNotification(
                    "Não foi possível carregar os dados dos módulos.",
                    true
                );
            });

        getSystemStatus().then((data) => {
            setIsSystemActive(data.isActive);
        });
    }, [addNotification]);

    useEffect(() => {
        const interval = setInterval(() => {
            setModules((prevModules) =>
                prevModules.map((m) => ({
                    ...m,
                    currentHumidity:
                        m.currentHumidity +
                        Math.round((Math.random() - 0.5) * 2),
                }))
            );
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleToggleSystem = () => {
        toggleSystemStatus()
            .then((data) => {
                setIsSystemActive(data.isActive);
                addNotification(
                    `Sistema geral ${data.isActive ? "ATIVADO" : "DESATIVADO"}.`
                );
            })
            .catch((err) => {
                console.error("Falha ao alterar status do sistema:", err);
                addNotification("Erro ao alterar status do sistema.", true);
            });
    };

    return { modules, setModules, isSystemActive, handleToggleSystem };
}