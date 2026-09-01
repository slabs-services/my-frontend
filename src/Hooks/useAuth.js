import { useState } from "react";
import { useComponentContext } from "../Contexts/ComponentContext";
import { updateAlert, GetMYAccountClient } from "../Utils";

export default function useAuth(){
    const { setIsLoading, setAlert } = useComponentContext();

    const [userInfo, setUserInfo] = useState({
        name: "",
        email: ""
    });

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    async function getUserInfo(){
        if(isAuthenticated){
            return;
        }
        
        try {
            const getUserInfo = new URL(
                "/userInfo",
                import.meta.env.VITE_MY_API_URL
            );

            const response = await fetch(getUserInfo, {
                credentials: "include"
            });

            if (response.status === 502) {
                updateAlert(setAlert, "severity", 3);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", "My service is temporarily unavailable.");
                setIsLoading(false);
                setIsInitialized(true);
                return;
            }

            let data = null;

            try {
                data = await response.json();
            } catch (e) {
                updateAlert(setAlert, "severity", 3);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", "Unknown Error");
                setIsLoading(false);
                setIsInitialized(true);
                return;
            }

            if (!response.ok) {
                window.location.href = import.meta.env.VITE_AUTH_REDIRECT + "/?" + GetMYAccountClient();
                setIsLoading(false);
                setIsInitialized(true);
                return;
            }

            setUserInfo(data);
            setIsAuthenticated(true);
        } catch (e) {
            updateAlert(setAlert, "severity", 3);
            updateAlert(setAlert, "showAlert", true);
            updateAlert(setAlert, "message", "Unable to connect to the my service.");
            setIsLoading(false);
            setIsInitialized(true);
        }
    }

    return {
        setUserInfo,
        userInfo,
        getUserInfo,
        isAuthenticated
    };
}