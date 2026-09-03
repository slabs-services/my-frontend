import AlertBox from "../Components/Alert";
import { useComponentContext } from "../Contexts/ComponentContext";
import PageWrapper from "../Components/PageWrapper";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { updateAlert, updateValidation } from "../Utils";
import { FaArrowLeft, FaCheckCircle, FaCopy } from "react-icons/fa";
import QRCode from "react-qr-code";
import { IoReload } from "react-icons/io5";
import { ConfirmModal } from "../Modals/Confirm";

export default function MFAChange() {
    const navigate = useNavigate();
    const { alert, setAlert, setIsLoading, setModal } = useComponentContext();
    const [otpCode, setOtpCode] = useState("");
    const [mfaQRCode, setMfaQRCode] = useState("");
    const [clipboardSuccess, setClipboardSuccess] = useState(false);
    const [regenerateSuccess, setRegenerateSuccess] = useState(false);
    const [validations, setValidations] = useState([
        {
            field: "otp",
            message: ""
        }
    ]);

    async function GetMFASecret(forceRegenerate){
        if(forceRegenerate){
            setModal(null);
        }

        updateAlert(setAlert, "showAlert", false);
        updateAlert(setAlert, "hideContent", true);
        setIsLoading(true);

        try {
            const mfaConfig = new URL(
                "/mfaConfig",
                import.meta.env.VITE_MY_API_URL
            );

            mfaConfig.searchParams.append('forceNew', forceRegenerate);

            const response = await fetch(mfaConfig, {
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

            if(forceRegenerate){
                setRegenerateSuccess(true);
                setTimeout(() => setRegenerateSuccess(false), 2000);
            }
            updateAlert(setAlert, "hideContent", false);
            setMfaQRCode(data.mfaQRCode);
            setIsLoading(false);
        } catch (e) {
            updateAlert(setAlert, "severity", 3);
            updateAlert(setAlert, "showAlert", true);
            updateAlert(setAlert, "message", "Unable to connect to the my service.");
            setIsLoading(false);
        }
    }

    useEffect(() => {
        GetMFASecret(false);
    }, []);

    async function handleSubmit(e){
        e.preventDefault();
        setIsLoading(true);
        validations.forEach((validation) => {
            updateValidation(setValidations, validation.field, "");
        });

        const changeMFA = new URL(
            "/validateMFA",
            import.meta.env.VITE_MY_API_URL
        );

        try {
            const response = await fetch(changeMFA, {
                method: 'PATCH',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    mfaCode: otpCode
                })
            });

            if (response.status === 502) {
                updateAlert(setAlert, "severity", 3);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", "My service is temporarily unavailable.");
                setIsLoading(false);
                setIsInitialized(true);
                return;
            }

            try {
                const data = await response.json();

                if (!response.ok) {
                    if(data.field === "alert"){
                        updateAlert(setAlert, "severity", data.severity);
                        updateAlert(setAlert, "showAlert", true);
                        updateAlert(setAlert, "message", data.message);
                        updateAlert(setAlert, "hideContent", data.hideContent);
                    }else{
                        updateValidation(setValidations, data.field, data.message);
                    }
                    setIsLoading(false);
                    return;
                }

                updateAlert(setAlert, "severity", 1); 
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", data.message);
                updateAlert(setAlert, "hideContent", false);
                setIsLoading(false);
                setTimeout(() => {
                    updateAlert(setAlert, "showAlert", false);
                }, 2000);
            }catch(e){
                updateAlert(setAlert, "severity", 3);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", "Unknown Error");
                setIsLoading(false);
                return;
            }
        }catch(e){
            updateAlert(setAlert, "severity", 3);
            updateAlert(setAlert, "showAlert", true);
            updateAlert(setAlert, "message", "My service is temporarily unavailable.");
            setIsLoading(false);
            return;
        }
    }

    function clearFeedbackErrors(field) {
        updateValidation(setValidations, field, "");
        updateAlert(setAlert, "showAlert", false);
    }

    async function copyMFAConfigKey(){
        const configUrl = new URL(mfaQRCode);
        const secret = configUrl.searchParams.get("secret");
        await navigator.clipboard.writeText(secret);

        setClipboardSuccess(true);
        setTimeout(() => setClipboardSuccess(false), 2000);
    }

    function regenerateMFASecret(){
        setModal(<ConfirmModal actionCancel={() => { setModal(null); }} actionConfirm={() => { GetMFASecret(true); }} contentText="Are you sure you want to generate a new MFA key? If you’ve already scanned the current key, it will no longer work, and you’ll need to scan the QRCode again." headerText="Generate MFA Secret" />);
    }

    return (
        <PageWrapper>
            <div className="flex items-center gap-x-4">
                <FaArrowLeft className="w-6 h-6 text-zinc-700 hover:cursor-pointer" onClick={() => { navigate("/settings"); }} />
                <h1 className="text-3xl font-bold text-zinc-700">Change MFA</h1>
            </div>
            <div className="mt-6 gap-y-2 flex flex-col p-4 bg-white shadow">
                <AlertBox alert={alert} className="w-125" />
                { !alert.hideContent ?
                    <form className="flex flex-col gap-y-4 w-125" onSubmit={handleSubmit}>
                        <p>1. Do you want to change your MFA Device? Let's start scanning the QRCode bellow. You can scan the QR code below using an app such as <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank" className="hover:text-blue-800 text-blue-700 font-bold">Google Authenticator</a> or <a href="https://play.google.com/store/apps/details?id=com.azure.authenticator" target="_blank" className="hover:text-blue-800 text-blue-700 font-bold">Microsoft Authenticator</a>.</p>
                        <QRCode value={mfaQRCode} level="H" size={150} />
                        <div className="flex flex-col gap-y-1">
                            { !clipboardSuccess ?
                                <div className="flex items-center gap-x-1 p-1 bg-gray-100 rounded hover:cursor-pointer hover:bg-gray-200 select-none w-fit" onClick={() => { copyMFAConfigKey(); }}>
                                    <FaCopy className="w-4 h-4 text-gray-800" />
                                    <p className="text-gray-800 text-xs">Copy Configuration Key</p>
                                </div> :
                                <div className="flex items-center gap-x-1 p-1 bg-green-100 rounded select-none w-fit">
                                    <FaCheckCircle className="w-4 h-4 text-green-900" />
                                    <p className="text-green-900 text-xs">Configuration Key Copied</p>
                                </div>
                            }
                            { !regenerateSuccess ?
                                <div className="flex items-center gap-x-1 p-1 bg-gray-100 rounded hover:cursor-pointer hover:bg-gray-200 select-none w-fit" onClick={() => { regenerateMFASecret(); }}>
                                    <IoReload className="w-4 h-4 text-gray-800" />
                                    <p className="text-gray-800 text-xs">Generate New MFA Secret</p>
                                </div> :
                                <div className="flex items-center gap-x-1 p-1 bg-green-100 rounded select-none w-fit">
                                    <FaCheckCircle className="w-4 h-4 text-green-900" />
                                    <p className="text-green-900 text-xs">New MFA Secret Generated</p>
                                </div>
                            }
                        </div>
                        <p>2. Now enter the OTP code from your authenticator app.</p>
                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="otp">OTP Code</label>
                            <input required type="text" id="otp" minLength={6} maxLength={6} placeholder="999999" autoComplete="one-time-code" autoCorrect="off" autoCapitalize="off" className="p-1 border rounded border-slate-400 outline-none focus:border-blue-600 text-slate-900" value={otpCode} onChange={(e) => { setOtpCode(e.target.value); clearFeedbackErrors(e.target.id); }} />
                            { validations.find((validation) => {return validation.field === "otp"}).message !== "" ? <p className="text-red-600">{validations.find((validation) => {return validation.field === "otp"}).message}</p> : null }
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white hover:cursor-pointer" type="submit">Change MFA</button>
                    </form>
                : null }
            </div>
        </PageWrapper>
    );
}