import { useEffect } from "react";
import AlertBox from "../Components/Alert";
import { updateAlert } from "../Utils";
import PageWrapper from "../Components/PageWrapper";
import { useLocation, useNavigate } from "react-router-dom";
import { useComponentContext } from "../Contexts/ComponentContext";

export default function ConfirmEmailChange() {
    const location = useLocation();
    const navigate = useNavigate();
    const { alert, setAlert, setIsLoading } = useComponentContext();

    useEffect(() => {
        async function checkEmailChange() {
            const searchParams = new URLSearchParams(location.search);

            if(!searchParams.has("activationKey")){
                setIsLoading(false);
                updateAlert(setAlert, "severity", 3);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", "Missing Activation Key Parameter");
                return;
            }
        
            try {
                const confirmEmailChange = new URL(
                    "/verify-email",
                    import.meta.env.VITE_MY_API_URL
                );

                confirmEmailChange.searchParams.append('activationKey', searchParams.get("activationKey"));

                const response = await fetch(confirmEmailChange, {
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

                updateAlert(setAlert, "severity", 1);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", data.message);
                updateAlert(setAlert, "hideContent", false);
                setIsLoading(false);
            } catch (e) {
                updateAlert(setAlert, "severity", 3);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", "Unable to connect to the my service.");
                setIsLoading(false);
            }
        }

        checkEmailChange();
    }, []);

    return(
        <PageWrapper ignoreLocalAuth={true}>
            <h1 className="text-3xl font-bold text-zinc-700">Email Verification</h1>
            <div className="mt-6 w-125 gap-y-2 flex flex-col">
                <AlertBox alert={alert} />
                { !alert.hideContent ?
                    <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white hover:cursor-pointer" onClick={() => { navigate("/my"); }}>Go to My Account</button>
                : null }
            </div>
        </PageWrapper>
    );
}