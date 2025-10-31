import { twMerge } from "tailwind-merge";
import clsx from "clsx";

const Button = ({ children, className, variant = "primary", ...props }) => {
    const baseStyles =
        "px-4 py-2 rounded-lg font-bold transition-all duration-200 ease-in-out flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none";

    const variants = {
        primary:
            "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg transform hover:-translate-y-px",
        danger: "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900/80",
        action: "bg-blue-500 text-white hover:bg-blue-600",
    };

    const finalClassName = twMerge(
        clsx(baseStyles, variants[variant], className)
    );

    return (
        <button className={finalClassName} {...props}>
            {children}
        </button>
    );
};

export default Button;