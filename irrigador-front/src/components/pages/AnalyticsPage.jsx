import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";
import { FileDown, LoaderCircle } from "lucide-react";

export const AnalyticsPage = ({
    modules,
    waterCost,
    onWaterCostChange,
    isExporting,
    setIsExporting,
    addNotification,
}) => {
    const commonChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                ticks: {
                    color: document.documentElement.classList.contains("dark")
                        ? "#9ca3af"
                        : "#6b7280",
                },
            },
            x: {
                ticks: {
                    color: document.documentElement.classList.contains("dark")
                        ? "#9ca3af"
                        : "#6b7280",
                },
            },
        },
        plugins: { legend: { display: false } },
    };

    const waterConsumptionData = {
        labels: modules.map((m) => m.name),
        datasets: [
            {
                label: "Consumo de Água (L)",
                data: modules.map((m) => m.waterConsumed),
                backgroundColor: "rgba(59, 130, 246, 0.7)",
                borderColor: "rgba(59, 130, 246, 1)",
                borderWidth: 1,
            },
        ],
    };

    const irrigationFrequencyData = {
        labels: modules.map((m) => m.name),
        datasets: [
            {
                label: "Frequência de Irrigações",
                data: modules.map((m) => m.irrigationCount),
                backgroundColor: "rgba(34, 197, 94, 0.7)",
                borderColor: "rgba(34, 197, 94, 1)",
                borderWidth: 1,
            },
        ],
    };

    const totalWater = modules.reduce((sum, m) => sum + m.waterConsumed, 0);
    const totalCost = (totalWater / 1000) * waterCost;

    const exportPDF = async () => {
        setIsExporting(true);
        const loadScript = (src) =>
            new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`))
                    return resolve();
                const script = document.createElement("script");
                script.src = src;
                script.onload = () => resolve();
                script.onerror = () =>
                    reject(new Error(`Script load error for ${src}`));
                document.head.appendChild(script);
            });

        try {
            await loadScript(
                "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
            );
            await loadScript(
                "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.1/jspdf.plugin.autotable.min.js"
            );

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.text("Relatório de Irrigação", 14, 20);
            doc.setFontSize(12);
            doc.text(
                `Gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
                14,
                28
            );

            const tableColumn = [
                "ID",
                "Nome",
                "Umidade Atual",
                "Limiar",
                "Consumo (L)",
                "Custo (R$)",
            ];
            const tableRows = [];
            modules.forEach((m) => {
                const cost = (m.waterConsumed / 1000) * waterCost;
                const moduleData = [
                    m.id,
                    m.name,
                    `${m.currentHumidity}%`,
                    `${m.humidityThreshold}%`,
                    m.waterConsumed.toFixed(1),
                    `R$ ${cost.toFixed(2)}`,
                ];
                tableRows.push(moduleData);
            });

            doc.autoTable({ head: [tableColumn], body: tableRows, startY: 35 });

            const finalY = doc.previousAutoTable.finalY;
            doc.setFontSize(14);
            doc.text("Resumo Geral", 14, finalY + 15);
            doc.setFontSize(12);
            doc.text(
                `Consumo Total de Água: ${totalWater.toFixed(1)} L`,
                14,
                finalY + 22
            );
            doc.text(
                `Custo Total Estimado: R$ ${totalCost.toFixed(2)}`,
                14,
                finalY + 29
            );

            doc.save("relatorio_irrigacao.pdf");
            addNotification("Relatório em PDF exportado com sucesso.");
        } catch (error) {
            console.error("Erro ao exportar PDF:", error);
            addNotification("Falha ao exportar PDF. Verifique sua conexão.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                    Análise e Relatórios
                </h2>
                <button
                    onClick={exportPDF}
                    disabled={isExporting}
                    className="btn-primary flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                >
                    {isExporting ? (
                        <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                        <FileDown size={16} />
                    )}
                    {isExporting ? "Exportando..." : "Exportar Relatório (PDF)"}
                </button>
            </div>

            <div className="card">
                <h3 className="text-xl font-semibold mb-2">Resumo Geral</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                        <p className="text-2xl font-bold">{modules.length}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Módulos Ativos
                        </p>
                    </div>
                    <div className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                        <p className="text-2xl font-bold">
                            {totalWater.toFixed(1)} L
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Consumo Total
                        </p>
                    </div>
                    <div className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                        <p className="text-2xl font-bold">
                            R$ {totalCost.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Custo Estimado
                        </p>
                    </div>
                    <div className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                        <label className="text-sm text-gray-500 dark:text-gray-400">
                            Custo/m³ (R$)
                        </label>
                        <input
                            type="number"
                            value={waterCost}
                            onChange={onWaterCostChange}
                            className="input-style w-full text-center p-1 mt-1 font-bold text-lg hide-arrows"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card">
                    <h3 className="text-xl font-semibold mb-4">
                        Consumo de Água por Módulo (L)
                    </h3>
                    <div className="h-80">
                        <Bar
                            options={commonChartOptions}
                            data={waterConsumptionData}
                        />
                    </div>
                </div>
                <div className="card">
                    <h3 className="text-xl font-semibold mb-4">
                        Frequência de Irrigações
                    </h3>
                    <div className="h-80">
                        <Bar
                            options={commonChartOptions}
                            data={irrigationFrequencyData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;