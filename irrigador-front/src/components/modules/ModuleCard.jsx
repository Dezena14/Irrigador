import { useState, useEffect } from "react";
import {
    Pencil,
    Save,
    Wifi,
    WifiOff,
    Droplets,
    X,
    History,
    Trash2,
} from "lucide-react";
import LineChart from "./LineChart";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";
import { updateModule, fetchModuleHistory } from "../../api/services";

const ModuleCard = ({
    module,
    onUpdate,
    onToggleManual,
    onDelete,
    onShowHistory,
}) => {
    const [isEditingLimiar, setIsEditingLimiar] = useState(false);
    const [limiarValue, setLimiarValue] = useState(module.humidityThreshold);
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameValue, setNameValue] = useState(module.name);
    const [previewHistory, setPreviewHistory] = useState([]);
    const isHardwareOffline = module.hardwareStatus === "offline";

    useEffect(() => {
        const loadPreviewHistory = async () => {
            if (isHardwareOffline) return;
            try {
                const history = await fetchModuleHistory(module.id);
                setPreviewHistory(history.slice(0, 7).reverse());
            } catch (e) {
                console.error("Falha ao buscar preview:", e);
            }
        };
        loadPreviewHistory();
    }, [module.id, isHardwareOffline]);

    const handleSave = async (type) => {
        if (type === "name" && nameValue.trim()) {
            const updatedData = {
                name: nameValue.trim(),
                humidityThreshold: module.humidityThreshold,
            };
            try {
                await updateModule(module.id, updatedData);
                onUpdate(module.id, { name: nameValue.trim() });
                setIsEditingName(false);
            } catch (error) {
                console.error("Falha ao atualizar nome:", error);
            }
        }
        if (type === "limiar") {
            const updatedData = {
                name: module.name,
                humidityThreshold: parseInt(limiarValue, 10),
            };
            try {
                await updateModule(module.id, updatedData);
                onUpdate(module.id, {
                    humidityThreshold: parseInt(limiarValue, 10),
                });
                setIsEditingLimiar(false);
            } catch (error) {
                console.error("Falha ao atualizar limiar:", error);
            }
        }
    };

    const statusInfo = {
        ok: {
            text: "Ideal",
            classes:
                "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
        },
        irrigando: {
            text: "Irrigando",
            classes:
                "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 animate-pulse",
        },
        manual_on: {
            text: "Manual Ativo",
            classes:
                "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 animate-pulse",
        },
        pausado: {
            text: "Pausado (Chuva)",
            classes:
                "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
        },
        manual_off: {
            text: "Manual Pausado",
            classes:
                "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100",
        },
        desligado: {
            text: "Desligado",
            classes:
                "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100",
        },
    }[module.status] || {
        text: "Indefinido",
        classes: "bg-gray-200 dark:bg-gray-600",
    };

    const getManualButtonInfo = () => {
        if (isHardwareOffline)
            return {
                text: "Dispositivo Offline",
                icon: WifiOff,
                disabled: true,
                classes: "bg-gray-400 text-white cursor-not-allowed",
            };

        if (module.manualOverride === "on") {
            return {
                text: "Parar Irrigação",
                icon: X,
                classes: "bg-red-500 hover:bg-red-600 text-white",
            };
        }

        return {
            text: "Irrigar Manualmente",
            icon: Droplets,
            classes: "bg-blue-500 hover:bg-blue-600 text-white",
        };
    };
    const manualButtonInfo = getManualButtonInfo();

    return (
        <Card
            className={`flex flex-col justify-between transition-all duration-300 hover:shadow-xl dark:hover:shadow-green-900/20 ${
                isHardwareOffline ? "opacity-60" : ""
            }`}
        >
            <div>
                <div className="flex justify-between items-start">
                    {isEditingName ? (
                        <div className="flex items-center gap-2 w-full">
                            <Input
                                type="text"
                                value={nameValue}
                                onChange={(e) => setNameValue(e.target.value)}
                                className="flex-grow text-xl font-bold p-1"
                                autoFocus
                            />
                            <Button
                                onClick={() => handleSave("name")}
                                variant="action"
                                className="p-2 text-sm"
                            >
                                <Save size={16} />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 group">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white truncate">
                                {module.name}
                            </h3>
                            <button
                                onClick={() => setIsEditingName(true)}
                                disabled={isHardwareOffline}
                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-20"
                            >
                                <Pencil size={14} />
                            </button>
                        </div>
                    )}
                    <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.classes}`}
                    >
                        {statusInfo.text}
                    </span>
                </div>
                <div className="flex justify-between items-baseline">
                    <p className="text-5xl font-bold my-4 text-gray-700 dark:text-gray-200">
                        {isHardwareOffline
                            ? "--"
                            : `${module.currentHumidity}%`}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        {isHardwareOffline ? (
                            <WifiOff size={16} className="text-red-500" />
                        ) : (
                            <Wifi size={16} className="text-green-500" />
                        )}
                        <span>{isHardwareOffline ? "Offline" : "Online"}</span>
                    </div>
                </div>
            </div>
            <div
                className="mt-4 h-32 relative cursor-pointer group"
                onClick={() => !isHardwareOffline && onShowHistory(module)}
            >
                <LineChart data={previewHistory} />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <History className="text-white" size={32} />
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 text-sm text-gray-500 dark:text-gray-400">
                {isEditingLimiar ? (
                    <div className="flex items-center gap-2">
                        <span>Limiar: {module.humidityThreshold}%</span>
                        <Input
                            type="number"
                            value={limiarValue}
                            onChange={(e) => setLimiarValue(e.target.value)}
                            className="w-20 text-center"
                        />
                        <Button
                            onClick={() => handleSave("limiar")}
                            variant="action"
                            className="p-2 text-sm"
                        >
                            <Save size={16} />
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span>Limiar: {module.humidityThreshold}%</span>
                        <button
                            onClick={() => setIsEditingLimiar(true)}
                            disabled={isHardwareOffline}
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-20"
                        >
                            <Pencil size={14} />
                        </button>
                    </div>
                )}
                <span>
                    <Droplets size={14} className="inline-block -mt-1" />{" "}
                    {module.waterConsumed.toFixed(1)}L
                </span>
            </div>
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 flex gap-3">
                <div className="flex-grow">
                    <button
                        onClick={() => onToggleManual(module.id)}
                        disabled={manualButtonInfo.disabled}
                        className={`w-full text-center py-2 px-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${manualButtonInfo.classes}`}
                    >
                        <manualButtonInfo.icon size={16} />{" "}
                        {manualButtonInfo.text}
                    </button>
                </div>
                <div className="flex flex-col">
                    <Button
                        variant="danger"
                        onClick={() => onDelete(module.id)}
                        disabled={isHardwareOffline}
                        className="p-3"
                    >
                        <Trash2 size={20} />
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ModuleCard;
