import { useState } from "react";
import { PlusCircle, Power, PowerOff } from "lucide-react";
import ModuleCard from "../modules/ModuleCard";
import AddModuleModal from "../modules/AddModuleModal";
import HistoryModal from "../modules/HistoryModal";
import ConfirmationModal from "../modules/ConfirmationModal";
import WeatherPanel from "../modules/WeatherPanel";
import {
    createModule,
    fetchModuleHistory,
    toggleModuleManualOverride,
} from "../../api/services";

export const ModulesPage = ({
    modules,
    setModules,
    weather,
    isSystemActive,
    setIsSystemActive,
    addNotification,
    location,
    setLocation,
}) => {
    const [modals, setModals] = useState({
        add: false,
        diagnostic: null,
        history: null,
        delete: null,
        journal: null,
    });
    const [historyData, setHistoryData] = useState([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);

    const handleAddModule = async ({ nome, limiar }) => {
        try {
            const moduleData = { name: nome, humidityThreshold: limiar };
            const newModuleFromApi = await createModule(moduleData);

            setModules((prev) => [...prev, newModuleFromApi]);
            addNotification(
                `Módulo "${newModuleFromApi.name}" foi adicionado.`
            );
        } catch (error) {
            console.error("Falha ao adicionar módulo:", error);
            addNotification("Erro ao adicionar novo módulo.", true);
        }
    };

    const handleDeleteModule = (id) => {
        const moduleName =
            modules.find((m) => m.id === id)?.nome || "desconhecido";
        setModules((prev) => prev.filter((m) => m.id !== id));
        addNotification(`Módulo "${moduleName}" foi removido.`);
    };

    const handleToggleManual = async (id) => {
        try {
            const updatedModule = await toggleModuleManualOverride(id);

            setModules((prevModules) =>
                prevModules.map((m) => (m.id === id ? updatedModule : m))
            );

            const msg =
                updatedModule.manualOverride === "on"
                    ? `Irrigação manual de "${updatedModule.name}" ativada.`
                    : `"${updatedModule.name}" retornou ao modo automático.`;
            addNotification(msg);
        } catch (error) {
            console.error("Falha ao alterar modo manual:", error);
            addNotification("Erro ao alterar modo manual.", true);
        }
    };

    const handleShowHistory = async (module) => {
        setModals((m) => ({ ...m, history: module }));
        setHistoryData([]);
        setIsHistoryLoading(true);

        try {
            const history = await fetchModuleHistory(module.id);
            const humidityValues = history.map((h) => h.humidity);
            setHistoryData(humidityValues);
        } catch (error) {
            console.error("Falha ao buscar histórico:", error);
            props.addNotification(
                "Erro ao carregar histórico do módulo.",
                true
            );
            setModals((m) => ({ ...m, history: null }));
        } finally {
            setIsHistoryLoading(false);
        }
    };

    return (
        <>
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                            Módulos de Monitoramento
                        </h2>
                        <button
                            onClick={() =>
                                setModals((m) => ({ ...m, add: true }))
                            }
                            className="btn-primary flex items-center gap-2"
                        >
                            <PlusCircle size={16} /> Adicionar
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {modules.map((module) => (
                            <ModuleCard
                                key={module.id}
                                module={module}
                                onUpdate={(id, data) =>
                                    setModules((ms) =>
                                        ms.map((m) =>
                                            m.id === id ? { ...m, ...data } : m
                                        )
                                    )
                                }
                                onToggleManual={handleToggleManual}
                                onDelete={(id) =>
                                    setModals((m) => ({ ...m, delete: id }))
                                }
                                onShowHistory={handleShowHistory}
                            />
                        ))}
                    </div>
                </div>
                <aside>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
                        Painel de Controle
                    </h2>
                    <div className="space-y-6">
                        <WeatherPanel
                            weather={weather}
                            location={location}
                            setLocation={setLocation}
                        />
                        <div className="card">
                            <h3 className="text-xl font-semibold pb-2">
                                Sistema Geral
                            </h3>
                            <button
                                onClick={() => setIsSystemActive((s) => !s)}
                                className={`w-full flex items-center justify-center gap-2 p-3 text-lg font-bold text-white rounded-lg transition-all ${
                                    isSystemActive
                                        ? "bg-green-500 hover:bg-green-600"
                                        : "bg-red-500 hover:bg-red-600"
                                }`}
                            >
                                {isSystemActive ? (
                                    <>
                                        <Power size={20} /> Ativo
                                    </>
                                ) : (
                                    <>
                                        <PowerOff size={20} /> Inativo
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </aside>
            </main>
            <AddModuleModal
                isOpen={modals.add}
                onClose={() => setModals((m) => ({ ...m, add: false }))}
                onAddModule={handleAddModule}
            />
            <HistoryModal
                module={modals.history}
                isOpen={!!modals.history}
                onClose={() => setModals((m) => ({ ...m, history: null }))}
                historyData={historyData}
                isLoading={isHistoryLoading}
            />

            <ConfirmationModal
                isOpen={!!modals.delete}
                onClose={() => setModals((m) => ({ ...m, delete: null }))}
                onConfirm={() => {
                    handleDeleteModule(modals.delete);
                    setModals((m) => ({ ...m, delete: null }));
                }}
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja remover o módulo "${
                    modules.find((m) => m.id === modals.delete)?.nome
                }"? Esta ação não pode ser desfeita.`}
            />
        </>
    );
};

export default ModulesPage;