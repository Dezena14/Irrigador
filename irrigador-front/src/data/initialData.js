// --- DADOS SIMULADOS INICIAIS ---
export const initialModules = [
    {
        id: 1,
        nome: "Tomateiro",
        umidade: 65,
        limiar: 50,
        historico: Array.from(
            { length: 30 },
            () => Math.floor(Math.random() * 15) + 55
        ),
        status: "ok",
        manualOverride: null,
        waterConsumed: 12.5,
        hardwareStatus: "online",
        irrigationCount: 5,
        journal: [],
        predictionAlert: false,
    },
    {
        id: 2,
        nome: "Alface",
        umidade: 48,
        limiar: 55,
        historico: Array.from(
            { length: 30 },
            () => Math.floor(Math.random() * 15) + 45
        ),
        status: "ok",
        manualOverride: null,
        waterConsumed: 25.2,
        hardwareStatus: "online",
        irrigationCount: 12,
        journal: [],
        predictionAlert: false,
    },
    {
        id: 3,
        nome: "Manjericão",
        umidade: 72,
        limiar: 60,
        historico: Array.from(
            { length: 30 },
            () => Math.floor(Math.random() * 10) + 68
        ),
        status: "ok",
        manualOverride: null,
        waterConsumed: 8.7,
        hardwareStatus: "online",
        irrigationCount: 3,
        journal: [],
        predictionAlert: false,
    },
];