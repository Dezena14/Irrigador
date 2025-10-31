import { Sun, Moon, Bell, AlertTriangle } from "lucide-react";

const Header = ({
    theme,
    toggleTheme,
    notifications,
    setNotifications,
    showNotifications,
    setShowNotifications,
    notificationRef,
}) => {
    return (
        <header className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">
                    Irrigador Automático
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Monitoramento Inteligente de Irrigação
                </p>
            </div>
            <div className="flex items-center gap-4">
                <div ref={notificationRef} className="relative">
                    <button
                        onClick={() => setShowNotifications((s) => !s)}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <Bell />
                        {notifications.length > 0 && (
                            <span
                                className={`absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ${
                                    notifications.some((n) => n.isAlert)
                                        ? "bg-red-500"
                                        : "bg-blue-500"
                                } animate-ping`}
                            ></span>
                        )}
                        {notifications.length > 0 && (
                            <span
                                className={`absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ${
                                    notifications.some((n) => n.isAlert)
                                        ? "bg-red-500"
                                        : "bg-blue-500"
                                }`}
                            ></span>
                        )}
                    </button>
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-20 animate-fade-in-fast">
                            <div className="p-3 font-bold border-b dark:border-gray-700 flex justify-between items-center">
                                <span>Notificações</span>
                                <button
                                    onClick={() => setNotifications([])}
                                    className="text-xs text-blue-500 hover:underline"
                                >
                                    Limpar
                                </button>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            className={`p-3 border-b dark:border-gray-700/50 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                                                n.isAlert
                                                    ? "bg-red-500/10 dark:bg-red-500/20"
                                                    : ""
                                            }`}
                                        >
                                            {n.isAlert && (
                                                <p className="font-bold text-red-500 flex items-center gap-1">
                                                    <AlertTriangle size={14} />
                                                    Alerta Preditivo
                                                </p>
                                            )}
                                            <p>{n.message}</p>
                                            <p className="text-xs text-gray-400">
                                                {n.time.toLocaleTimeString()}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="p-4 text-sm text-gray-500">
                                        Nenhuma notificação.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    {theme === "light" ? <Moon /> : <Sun />}
                </button>
            </div>
        </header>
    );
};

export default Header;