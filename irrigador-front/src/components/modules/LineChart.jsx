import { useRef, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

export const LineChart = ({ data, isDetailed = false }) => {
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState({ datasets: [] });

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                display: isDetailed,
                min: 0,
                max: 100,
                ticks: {
                    color: document.documentElement.classList.contains("dark")
                        ? "#9ca3af"
                        : "#6b7280",
                },
            },
            x: {
                display: isDetailed,
                ticks: {
                    color: document.documentElement.classList.contains("dark")
                        ? "#9ca3af"
                        : "#6b7280",
                },
            },
        },
        plugins: { legend: { display: false } },
        elements: {
            point: { radius: isDetailed ? 2 : 0 },
            line: { tension: 0.4 },
        },
    };

    useEffect(() => {
        const chart = chartRef.current;
        if (!chart) return;

        const ctx = chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
        gradient.addColorStop(0, "rgba(34, 197, 94, 0.5)");
        gradient.addColorStop(1, "rgba(34, 197, 94, 0)");

        setChartData({
            labels: isDetailed
                ? data.map((_, i) => `${30 - i}d atrás`)
                : Array.from({ length: 7 }).fill(""),
            datasets: [
                {
                    data: data,
                    borderColor: "#22c55e",
                    borderWidth: isDetailed ? 2 : 3,
                    fill: true,
                    backgroundColor: gradient,
                },
            ],
        });
    }, [data, isDetailed]);

    return <Line ref={chartRef} options={options} data={chartData} />;
};

export default LineChart;