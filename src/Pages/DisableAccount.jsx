import AlertBox from "../Components/Alert";
import { useComponentContext } from "../Contexts/ComponentContext";
import PageWrapper from "../Components/PageWrapper";
import { updateAlert, updateValidation } from "../Utils";
import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../Contexts/AuthContext";

export default function DisableAccount() {
    const navigate = useNavigate();
    const { alert, setIsLoading, setAlert } = useComponentContext();
    const { setIsAuthenticated } = useAuthContext();
    const [confirm, setConfirm] = useState("");
    const [validations, setValidations] = useState([
        {
            field: "confirm",
            message: ""
        }
    ]);

    useEffect(() => {
        updateAlert(setAlert, "hideContent", false);
        updateAlert(setAlert, "showAlert", false);
        setIsLoading(false);
    }, []);

    async function handleSubmit(e){
        e.preventDefault();
        setIsLoading(true);
        validations.forEach((validation) => {
            updateValidation(setValidations, validation.field, "");
        });

        if(confirm !== "confirm"){
            updateValidation(setValidations, "confirm", "The text does not match the required confirmation text");
            setConfirm('');
            setIsLoading(false);
            return;
        }

        const disableAccount = new URL(
            "/disableAccount",
            import.meta.env.VITE_MY_API_URL
        );

        try {
            const response = await fetch(disableAccount, {
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
                updateAlert(setAlert, "hideContent", true);
                setIsLoading(false);
                setIsAuthenticated(false);
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

    return (
        <PageWrapper>
            <div className="flex items-center gap-x-4">
                <FaArrowLeft className="w-6 h-6 text-zinc-700 hover:cursor-pointer" onClick={() => { navigate("/settings"); }} />
                <h1 className="text-3xl font-bold text-zinc-700">Disable Account</h1>
            </div>
            <div className="mt-6 gap-y-2 flex flex-col p-4 bg-white shadow">
                <AlertBox alert={alert} className="w-125" />
                { !alert.hideContent ?
                    <form className="flex flex-col gap-y-4 w-125" onSubmit={handleSubmit}>
                        <p>Do you want to disable your account? Let's start</p>
                        <div className="bg-red-50 border border-red-900 rounded p-4 shadow-xs text-red-900">
                            <ul className="list-disc flex flex-col gap-y-1">
                                <li className="ml-3">The user will no longer be able to sign in to SpaceLabs Cloud.</li>
                                <li className="ml-3">All new authentication attempts will be rejected, including password, passkey, and other authentication methods.</li>
                                <li className="ml-3">The user will no longer be able to authenticate through the IdP for applications that rely on this account.</li>
                                <li className="ml-3">New SSO sessions cannot be created.</li>
                                <li className="ml-3">Refresh tokens will be revoked, preventing the user from obtaining new access tokens.</li>
                                <li className="ml-3">Active sessions will be terminated or revoked, where supported.</li>
                                <li className="ml-3">Already-issued access tokens may remain valid until they expire, unless immediate token revocation or account-status validation is implemented.</li>
                                <li className="ml-3">All passkeys and other authenticators associated with the account will become unusable.</li>
                                <li className="ml-3">The account will be permanently disabled and cannot be re-enabled.</li>
                                <li className="ml-3">The user's account data and identity will no longer be usable for authentication.</li>
                                <li className="ml-3">Permissions, groups, and account configuration associated with the account will no longer grant access.</li>
                                <li className="ml-3">Creating a new account with the same email address will create a completely new identity. It will not restore, reuse, or inherit the previous account, passkeys, sessions, permissions, or other account data.</li>
                                <li className="ml-3">Applications must treat the new account as a different user, even if the email address is identical.</li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="confirm">Confirmation</label>
                            <input required type="text" id="confirm" placeholder='Please digit "confirm" to disable your account' autoComplete="off" autoCorrect="off" autoCapitalize="off" className="p-1 border rounded border-slate-400 outline-none focus:border-blue-600 text-slate-900" value={confirm} onChange={(e) => { clearFeedbackErrors(e.target.id); setConfirm(e.target.value); }} />
                            { validations.find((validation) => {return validation.field === "confirm"}).message !== "" ? <p className="text-red-600">{validations.find((validation) => {return validation.field === "confirm"}).message}</p> : null }
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white hover:cursor-pointer" type="submit">Disable Account</button>
                    </form>
                : null }
            </div>
        </PageWrapper>
    );
}