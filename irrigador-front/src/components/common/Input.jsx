import React from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    const finalClassName = twMerge(
        clsx(
            "input-style",
            { "hide-arrows": type === "number" },
            className
        )
    );

    return (
        <input type={type} className={finalClassName} ref={ref} {...props} />
    );
});

export default Input;