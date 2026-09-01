import { useState } from "react";

export default function useComponent(){
    const [isLoading, setIsLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [alert, setAlert] = useState({
        showAlert: false,
        severity: 0,
        message: "",
        hideContent: true
    });

    return {
        setAlert,
        alert,
        modal,
        setModal,
        isLoading,
        setIsLoading
    };
}