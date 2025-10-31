import { useState, useEffect, useRef, useCallback } from "react";

export function useNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    const addNotification = useCallback((message, isAlert = false) => {
        const newNotification = {
            id: Date.now(),
            time: new Date(),
            message,
            isAlert,
        };
        setNotifications((prev) => [newNotification, ...prev].slice(0, 50));
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [notificationRef]);

    return {
        notifications,
        setNotifications,
        showNotifications,
        setShowNotifications,
        notificationRef,
        addNotification,
    };
}