import { X, LoaderCircle } from "lucide-react";
import LineChart from "./LineChart";
import Card from "../common/Card";

const HistoryModal = ({ module, isOpen, onClose, historyData, isLoading }) => {
    if (!isOpen || !module) return null;

    const showLoading = isLoading;
    const showEmpty = !isLoading && historyData.length === 0;
    const showChart = !isLoading && historyData.length > 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <Card className="w-full max-w-3xl animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">
                        Histórico de Umidade: {module.name}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="h-96">
                    {showLoading && (
                        <div className="flex items-center justify-center h-full">
                            <LoaderCircle
                                className="animate-spin text-gray-400"
                                size={48}
                            />
                        </div>
                    )}
                    {showChart && (
                        <LineChart data={historyData} isDetailed={true} />
                    )}
                    {showEmpty && (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">
                                Nenhum dado de histórico encontrado para este
                                módulo.
                            </p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default HistoryModal;
