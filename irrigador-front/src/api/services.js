import { API_BASE_URL } from "../config";

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Algo deu errado na API");
    }
    const text = await response.text();
    return text ? JSON.parse(text) : {};
};

// --- Funções da API de Módulos ---

export const fetchModules = () => {
    return fetch(`${API_BASE_URL}/modules`).then(handleResponse);
};

export const updateModule = (id, moduleData) => {
    return fetch(`${API_BASE_URL}/modules/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(moduleData),
    }).then(handleResponse);
};

// --- Funções da API de Tempo ---

export const getCoordsFromCityName = async (cityName) => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Geocoding API failed");
        const data = await response.json();
        if (data && data.length > 0) {
            const { lat, lon, name, state, country } = data[0];
            return { lat, lon, name: `${name}, ${state || country}` };
        }
        return null;
    } catch (error) {
        console.error("Erro ao buscar coordenadas:", error);
        return null;
    }
};

export const fetchWeather = async ({ lat, lon }) => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather data not available");
    return response.json();
};

// --- Funções da API do Sistema ---

export const getSystemStatus = () => {
    return fetch(`${API_BASE_URL}/system/status`).then(handleResponse);
};

export const toggleSystemStatus = () => {
    return fetch(`${API_BASE_URL}/system/toggle`, {
        method: "POST",
    }).then(handleResponse);
};

export const createModule = (moduleData) => {
    return fetch(`${API_BASE_URL}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(moduleData),
    }).then(handleResponse);
};

export const fetchModuleHistory = (moduleId) => {
    return fetch(`${API_BASE_URL}/modules/${moduleId}/history`).then(
        handleResponse
    );
};

export const toggleModuleManualOverride = (moduleId) => {
    return fetch(`${API_BASE_URL}/modules/${moduleId}/manual-override`, {
        method: "POST",
    }).then(handleResponse);
};

export const deleteModule = (moduleId) => {
    return fetch(`${API_BASE_URL}/modules/${moduleId}`, {
        method: "DELETE",
    }).then(handleResponse);
};

export const getSystemSettings = () => {
    return fetch(`${API_BASE_URL}/system/settings`).then(handleResponse);
};

export const updateSystemSettings = (settingsData) => {
    return fetch(`${API_BASE_URL}/system/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsData),
    }).then(handleResponse);
};
