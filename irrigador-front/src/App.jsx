import { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    BarElement,
} from "chart.js";

import { useTheme } from "./hooks/useTheme";
import { useWeather } from "./hooks/useWeather";
import { useNotifications } from "./hooks/useNotifications";
import { useIrrigationSystem } from "./hooks/useIrrigationSystem";
import MainLayout from "./components/layout/MainLayout";
import ModulesPage from "./components/pages/ModulesPage";
import AnalyticsPage from "./components/pages/AnalyticsPage";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    BarElement
);

export default function App() {
    const { theme, toggleTheme } = useTheme();
    const { location, setLocation, weather } = useWeather();
    const {
        notifications,
        setNotifications,
        showNotifications,
        setShowNotifications,
        notificationRef,
        addNotification,
    } = useNotifications();
    const { modules, setModules, isSystemActive, handleToggleSystem } =
        useIrrigationSystem(weather, addNotification);

    const [activeView, setActiveView] = useState("modules");
    const [waterCost, setWaterCost] = useState(5.0);
    const [isExporting, setIsExporting] = useState(false);

    return (
        <MainLayout
            theme={theme}
            toggleTheme={toggleTheme}
            notifications={notifications}
            setNotifications={setNotifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            notificationRef={notificationRef}
            activeView={activeView}
            setActiveView={setActiveView}
        >
            {activeView === "modules" ? (
                <ModulesPage
                    modules={modules}
                    setModules={setModules}
                    weather={weather}
                    isSystemActive={isSystemActive}
                    setIsSystemActive={handleToggleSystem}
                    addNotification={addNotification}
                    location={location}
                    setLocation={setLocation}
                />
            ) : (
                <AnalyticsPage
                    modules={modules}
                    waterCost={waterCost}
                    onWaterCostChange={(e) =>
                        setWaterCost(parseFloat(e.target.value) || 0)
                    }
                    isExporting={isExporting}
                    setIsExporting={setIsExporting}
                    addNotification={addNotification}
                />
            )}
        </MainLayout>
    );
}