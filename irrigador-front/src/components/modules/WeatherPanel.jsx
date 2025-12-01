import {
    Cloud,
    CloudFog,
    CloudLightning,
    CloudRain,
    CloudSun,
    Droplets,
    LoaderCircle,
    Snowflake,
    Sun,
    Thermometer,
    Wind,
    XCircle,
    Pencil,
    Save,
    X,
} from "lucide-react";

import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";

const WeatherPanel = ({
    weather,
    location,
    isEditing,
    setIsEditing,
    isLoading,
    inputCity,
    setInputCity,
    inputThreshold,
    setInputThreshold,
    handleSave,
    handleCancel,
}) => {
    if (weather.loading || !location || location.name === "Carregando...") {
        return (
            <Card className="text-center">
                <LoaderCircle
                    className="animate-spin mx-auto text-gray-400"
                    size={32}
                />
                <p className="text-sm mt-2">Carregando previsão...</p>
            </Card>
        );
    }

    if (!weather.data) {
        return (
            <Card className="text-center bg-red-100 dark:bg-red-900/50">
                <XCircle className="mx-auto text-red-500" size={32} />
                <p className="text-sm mt-2 font-semibold text-red-700 dark:text-red-300">
                    Erro ao carregar dados.
                </p>
                <p className="text-xs mt-1 text-red-600 dark:text-red-400">
                    Verifique a chave da API.
                </p>
            </Card>
        );
    }

    const {
        temp,
        description,
        chanceChuva,
        icon,
        humidity,
        windSpeed,
        hourlyForecast,
    } = weather.data;

    const getWeatherIcon = (iconCode, size = 48) => {
        const classMap = {
            "01": "text-yellow-500",
            "02": "text-yellow-400",
            "03": "text-gray-400",
            "04": "text-gray-400",
            "09": "text-blue-400",
            10: "text-blue-400",
            11: "text-yellow-300",
            13: "text-blue-200",
            50: "text-gray-500",
        };
        const className = classMap[iconCode.substring(0, 2)] || "text-gray-400";
        if (iconCode.includes("01"))
            return <Sun size={size} className={className} />;
        if (iconCode.includes("02"))
            return <CloudSun size={size} className={className} />;
        if (iconCode.includes("03") || iconCode.includes("04"))
            return <Cloud size={size} className={className} />;
        if (iconCode.includes("09") || iconCode.includes("10"))
            return <CloudRain size={size} className={className} />;
        if (iconCode.includes("11"))
            return <CloudLightning size={size} className={className} />;
        if (iconCode.includes("13"))
            return <Snowflake size={size} className={className} />;
        if (iconCode.includes("50"))
            return <CloudFog size={size} className={className} />;
        return <Thermometer size={size} className={className} />;
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4 min-h-[40px]">
                {isEditing ? (
                    // --- MODO DE EDIÇÃO ---
                    <div className="flex flex-col gap-4 w-full">
                        <div>
                            <label className="text-sm font-medium dark:text-gray-300">
                                Cidade
                            </label>
                            <Input
                                type="text"
                                value={inputCity}
                                onChange={(e) => setInputCity(e.target.value)}
                                className="w-full"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium dark:text-gray-300">
                                Pausar irrigação se % de chuva for:{" "}
                            </label>
                            <Input
                                type="number"
                                value={inputThreshold}
                                onChange={(e) =>
                                    setInputThreshold(e.target.value)
                                }
                                className="w-full text-center"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button onClick={handleCancel} variant="secondary">
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={isLoading}
                                variant="primary"
                            >
                                {isLoading ? (
                                    <LoaderCircle
                                        size={16}
                                        className="animate-spin"
                                    />
                                ) : (
                                    "Salvar"
                                )}
                            </Button>
                        </div>
                    </div>
                ) : (
                    // --- MODO DE VISUALIZAÇÃO ---
                    <div className="flex items-center gap-2 group w-full">
                        <h3 className="text-xl font-semibold">
                            Previsão: {location.name}
                        </h3>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Pencil size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* --- Painel de Dados --- */}
            <div className="flex items-center gap-4">
                {getWeatherIcon(icon)}
                <div className="flex-grow">
                    <p className="text-4xl font-bold">{temp}°C</p>
                    <p className="capitalize">{description}</p>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm border-t border-b border-gray-200 dark:border-gray-700 py-4">
                <div>
                    <CloudRain className="mx-auto" size={20} />
                    <p>{chanceChuva}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Chuva
                    </p>
                </div>
                <div>
                    <Droplets className="mx-auto" size={20} />
                    <p>{humidity}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Umidade
                    </p>
                </div>
                <div>
                    <Wind className="mx-auto" size={20} />
                    <p>{windSpeed} km/h</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Vento
                    </p>
                </div>
            </div>

            <div className="mt-4">
                <h4 className="text-md font-semibold mb-2">Próximas horas</h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                    {hourlyForecast.map((forecast, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 dark:bg-gray-800/50 p-2 rounded-lg flex flex-col items-center justify-between"
                        >
                            <p className="text-xs font-semibold">
                                {forecast.time}
                            </p>
                            {getWeatherIcon(forecast.icon, 28)}
                            <div className="flex items-center gap-1 text-xs text-blue-500 dark:text-blue-400 mt-1">
                                <CloudRain size={12} />
                                <p className="font-bold">{forecast.pop}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default WeatherPanel;
