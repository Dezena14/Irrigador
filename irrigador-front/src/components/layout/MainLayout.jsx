import Header from "./Header";

const MainLayout = ({
    children,
    activeView,
    setActiveView,
    ...headerProps
}) => {
    return (
        <div className="text-gray-800 dark:text-gray-100 min-h-screen w-full font-sans">
            <div className="w-full max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
                <Header {...headerProps} />
                <nav className="mb-8 flex items-center gap-2 border-b-2 border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveView("modules")}
                        className={`px-4 py-2 font-semibold transition-colors ${
                            activeView === "modules"
                                ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
                                : "text-gray-500 hover:text-green-500"
                        }`}
                    >
                        Módulos
                    </button>
                    <button
                        onClick={() => setActiveView("analytics")}
                        className={`px-4 py-2 font-semibold transition-colors ${
                            activeView === "analytics"
                                ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
                                : "text-gray-500 hover:text-green-500"
                        }`}
                    >
                        Análise
                    </button>
                </nav>
                <main>{children}</main>
            </div>
        </div>
    );
};

export default MainLayout;