import { useState, useEffect } from "react";
import AlertBox from "../Components/Alert";
import { updateAlert } from "../Utils";
import { useLocation, useNavigate } from "react-router-dom";

export default function OAuth() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState({
        showAlert: false,
        severity: 0,
        message: "",
        hideContent: true
    });

    useEffect(() => {
        async function validateCode() {
            const searchParams = new URLSearchParams(location.search);

            if(!searchParams.has("code")){
                setIsLoading(false);
                updateAlert(setAlert, "severity", 3);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", "Missing Code Parameter");
                return;
            }
        
            try {
                const oauthCheck = new URL(
                    "/convertOAuthCode",
                    import.meta.env.VITE_MY_API_URL
                );

                oauthCheck.searchParams.append('code', searchParams.get("code"));

                const response = await fetch(oauthCheck, {
                    credentials: "include"
                });

                if (response.status === 502) {
                    updateAlert(setAlert, "severity", 3);
                    updateAlert(setAlert, "showAlert", true);
                    updateAlert(setAlert, "message", "My service is temporarily unavailable.");
                    setIsLoading(false);
                    return;
                }

                let data = null;

                try {
                    data = await response.json();
                } catch (e) {
                    updateAlert(setAlert, "severity", 3);
                    updateAlert(setAlert, "showAlert", true);
                    updateAlert(setAlert, "message", "Unknown Error.");
                    setIsLoading(false);
                    return;
                }

                if (!response.ok) {
                    updateAlert(setAlert, "severity", data.severity);
                    updateAlert(setAlert, "showAlert", true);
                    updateAlert(setAlert, "message", data.message);
                    updateAlert(setAlert, "hideContent", data.hideContent);
                    setIsLoading(false);
                    return;
                }

                updateAlert(setAlert, "hideContent", false);
                navigate("/my");
            } catch (e) {
                updateAlert(setAlert, "severity", 3);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", "Unable to connect to the my service.");
                setIsLoading(false);
            }
        }

        validateCode();
    }, []);

    return(
        <div className="bg-gray-50 w-full h-full absolute flex items-center flex-col font-roboto">
            { isLoading ? <div className="w-full h-full absolute bg-black/50 flex items-center justify-center">
                <img src="/loading.svg" title="Loading" alt="Loading" className="w-16 animate-spin" />
            </div> : null }
            <div className="bg-[#252f3d] w-full p-3 flex justify-center">
                <div className="w-2/3">
                    <img src="/logo-big.svg" title="Logo" alt="Logo" className="h-6" />
                </div>
            </div>
            <div className="w-full p-3 flex justify-center">
                <div className="w-2/3">
                    <AlertBox alert={alert} />
                    { !alert.hideContent ?
                    <>
                        <h1 className="text-3xl font-bold text-zinc-700">We will redirect you in a moment</h1>
                    </> : null }
                </div>
            </div>
        </div>
    );
}