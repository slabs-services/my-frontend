import AlertBox from "../Components/Alert";
import { useComponentContext } from "../Contexts/ComponentContext";
import PageWrapper from "../Components/PageWrapper";
import { updateAlert } from "../Utils";
import { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { startRegistration } from "@simplewebauthn/browser";

export default function ManagePasskeys() {
    const navigate = useNavigate();
    const { alert, setIsLoading, setAlert } = useComponentContext();

    useEffect(() => {
        async function GetPasskeysConfig(){
            updateAlert(setAlert, "hideContent", false); // needs to be true
            updateAlert(setAlert, "showAlert", false);
            setIsLoading(false);
        }
        GetPasskeysConfig();
    }, []);

    async function handleAddPasskey() {
        setIsLoading(true);
        try {
            const passkeysConfig = new URL(
                "/passkeyOptions",
                import.meta.env.VITE_MY_API_URL
            );

            const response = await fetch(passkeysConfig, {
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
                updateAlert(setAlert, "message", "Unknown Error");
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

            try {
                const registerPasskey = await startRegistration({ optionsJSON: data.options });
                await savePasskey(data.srnValidation, registerPasskey);
            }catch(passkeyError){
                if (passkeyError.name === "NotAllowedError") {
                    setIsLoading(false);
                    return;
                }
                if (passkeyError.name === "InvalidStateError") {
                    updateAlert(setAlert, "severity", 2);
                    updateAlert(setAlert, "showAlert", true);
                    updateAlert(setAlert, "message", "This passkey is already registered.");
                    setIsLoading(false);
                    return;
                }
                updateAlert(setAlert, "severity", 3);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", "Unknown Error with passkey");
                setIsLoading(false);
            }
        } catch (e) {
            updateAlert(setAlert, "severity", 3);
            updateAlert(setAlert, "showAlert", true);
            updateAlert(setAlert, "message", "Unable to connect to the my service.");
            setIsLoading(false);
        }
    }

    async function savePasskey(srnValidation, registerPasskey){
        try {
            const savePasskeysConfig = new URL(
                "/savePasskey",
                import.meta.env.VITE_MY_API_URL
            );

            const responseSave = await fetch(savePasskeysConfig, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    passkeyValidationSrn: srnValidation,
                    passkeyBody: registerPasskey
                })
            });

            if (responseSave.status === 502) {
                updateAlert(setAlert, "severity", 3);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", "My service is temporarily unavailable.");
                setIsLoading(false);
                return;
            }

            let data = null;

            try {
                data = await responseSave.json();
            } catch (e) {
                updateAlert(setAlert, "severity", 3);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", "Unknown Error");
                setIsLoading(false);
                return;
            }

            if (!responseSave.ok) {
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
            setIsLoading(false);
        } catch (e) {
            updateAlert(setAlert, "severity", 3);
            updateAlert(setAlert, "showAlert", true);
            updateAlert(setAlert, "message", "Unable to connect to the my service.");
            setIsLoading(false);
        }
    }

    return (
        <PageWrapper>
            <div className="flex items-center gap-x-4">
                <FaArrowLeft className="w-6 h-6 text-zinc-700 hover:cursor-pointer" onClick={() => { navigate("/settings"); }} />
                <h1 className="text-3xl font-bold text-zinc-700">Manage Passkeys</h1>
            </div>
            <div className="mt-6 gap-y-2 flex flex-col p-4 bg-white shadow">
                <AlertBox alert={alert} className="w-125" />
                { !alert.hideContent ?
                    <div className="flex flex-col gap-y-2 w-125">
                        <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white hover:cursor-pointer w-1/3" onClick={() => { handleAddPasskey(); }}>Add Passkey</button>
                        <p>List of your passkeys</p>
                    </div>
                : null }
            </div>
        </PageWrapper>
    );
}