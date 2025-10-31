import { useState, useEffect } from "react";
import { PlusCircle, X } from "lucide-react";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";

const AddModuleModal = ({ isOpen, onClose, onAddModule }) => {
    const [nome, setNome] = useState("");
    const [limiar, setLimiar] = useState(50);

    const plantPresets = [
        "Tomate",
        "Alface",
        "Manjericão",
        "Hortelã",
        "Samambaia",
        "Suculenta",
        "Orquídea",
    ];

    const handlePresetChange = (e) => {
        const plantName = e.target.value;
        if (!plantName) return;
        setNome(plantName);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nome.trim()) {
            onAddModule({ nome, limiar: parseInt(limiar, 10) });
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            setNome("");
            setLimiar(50);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <Card
                as="form"
                onSubmit={handleSubmit}
                className="w-full max-w-lg animate-fade-in"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <PlusCircle size={20} /> Adicionar Módulo
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-4">
                    <select
                        onChange={handlePresetChange}
                        className="input-style"
                    >
                        <option value="">Ou escolha um perfil...</option>
                        {plantPresets.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>
                    <Input
                        id="plant-name"
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Nome da Planta"
                        required
                    />
                    <div>
                        <label
                            htmlFor="plant-threshold"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Limiar de Umidade Ideal (%)
                        </label>
                        <Input
                            id="plant-threshold"
                            type="number"
                            value={limiar}
                            onChange={(e) => setLimiar(e.target.value)}
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <Button type="button" onClick={onClose} variant="secondary">
                        Cancelar
                    </Button>
                    <Button type="submit">Adicionar</Button>
                </div>
            </Card>
        </div>
    );
};

export default AddModuleModal;