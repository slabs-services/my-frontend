import { useState } from "react";
import { useComponentContext } from "../Contexts/ComponentContext";
import { updateAlert, GetMYAccountClient } from "../Utils";

export default function useAuth(){
    const { setIsLoading, setAlert, setModal } = useComponentContext();

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
                return;
            }

            let data = null;

            try {
                data = await response.json();
            } catch (e) {
                updateAlert(setAlert, "severity", 3);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", "Unknown Error");
                return;
            }

            if (!response.ok) {
                window.location.href = import.meta.env.VITE_AUTH_REDIRECT + "/?" + GetMYAccountClient();
                return;
            }

            setUserInfo(data);
            setIsAuthenticated(true);
        } catch (e) {
            updateAlert(setAlert, "severity", 3);
            updateAlert(setAlert, "showAlert", true);
            updateAlert(setAlert, "message", "Unable to connect to the my service.");
        }
    }

    async function logout(){
        setIsLoading(true);

        try {
            const logout = new URL(
                "/logout",
                import.meta.env.VITE_MY_API_URL
            );

            const response = await fetch(logout, {
                credentials: "include"
            });

            if (response.status === 502) {
                updateAlert(setAlert, "severity", 3);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", "My service is temporarily unavailable.");
                setIsLoading(false);
                return;
            }

            try {
                const data = await response.json();

                if (!response.ok) {
                    updateAlert(setAlert, "severity", data.severity);
                    updateAlert(setAlert, "showAlert", true);
                    updateAlert(setAlert, "message", data.message);
                    updateAlert(setAlert, "hideContent", data.hideContent);
                    setIsLoading(false);
                    setModal(null);
                    return;
                }

                updateAlert(setAlert, "severity", 1); 
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", data.message);
                updateAlert(setAlert, "hideContent", false);
                setIsLoading(false);
                setModal(null);
                setIsAuthenticated(false);
            }catch(e){
                updateAlert(setAlert, "severity", 3);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", "Unknown Error");
                setIsLoading(false);
                setModal(null);
                return;
            }
        } catch (e) {
            updateAlert(setAlert, "severity", 3);
            updateAlert(setAlert, "showAlert", true);
            updateAlert(setAlert, "message", "Unable to connect to the my service.");
            setIsLoading(false);
            setModal(null);
        }
    }

    return {
        setUserInfo,
        userInfo,
        getUserInfo,
        isAuthenticated,
        logout,
        setIsAuthenticated
    };
}