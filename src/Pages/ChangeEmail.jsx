import AlertBox from "../Components/Alert";
import { useComponentContext } from "../Contexts/ComponentContext";
import { useAuthContext } from "../Contexts/AuthContext";
import PageWrapper from "../Components/PageWrapper";
import { updateAlert, updateValidation } from "../Utils";
import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ChangeEmail() {
    const navigate = useNavigate();
    const { alert, setIsLoading, setAlert } = useComponentContext();
    const { userInfo } = useAuthContext();
    const [email, setEmail] = useState("");
    const [validations, setValidations] = useState([
        {
            field: "email",
            message: ""
        }
    ]);

    useEffect(() => {
        async function GetPendingEmailChanges(){
            updateAlert(setAlert, "hideContent", true);
            updateAlert(setAlert, "showAlert", false);
            setIsLoading(true);

            try {
                const pendingEmailChanges = new URL(
                    "/pendingEmailChanges",
                    import.meta.env.VITE_MY_API_URL
                );

                const response = await fetch(pendingEmailChanges, {
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

                setEmail(userInfo.email);
                updateAlert(setAlert, "hideContent", false);
                setIsLoading(false);
            } catch (e) {
                updateAlert(setAlert, "severity", 3);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", "Unable to connect to the my service.");
                setIsLoading(false);
            }
        }

        GetPendingEmailChanges();
    }, [userInfo]);

    async function handleSubmit(e){
        e.preventDefault();
        setIsLoading(true);
        validations.forEach((validation) => {
            updateValidation(setValidations, validation.field, "");
        });

        const changeEmail = new URL(
            "/changeEmail",
            import.meta.env.VITE_MY_API_URL
        );

        try {
            const response = await fetch(changeEmail, {
                method: 'POST',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email
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

    return (
        <PageWrapper>
            <div className="flex items-center gap-x-4">
                <FaArrowLeft className="w-6 h-6 text-zinc-700 hover:cursor-pointer" onClick={() => { navigate("/settings"); }} />
                <h1 className="text-3xl font-bold text-zinc-700">Change Email</h1>
            </div>
            <div className="mt-6 gap-y-2 flex flex-col p-4 bg-white shadow">
                <AlertBox alert={alert} className="w-125" />
                { !alert.hideContent ?
                    <form className="flex flex-col gap-y-4 w-125" onSubmit={handleSubmit}>
                        <p>Do you want to change your email? Let's start</p>
                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="email">New Email address</label>
                            <input required type="email" id="email" placeholder="example@domain.com" autoComplete="email" autoCorrect="off" autoCapitalize="off" className="p-1 border rounded border-slate-400 outline-none focus:border-blue-600 text-slate-900" value={email} onChange={(e) => { clearFeedbackErrors(e.target.id); setEmail(e.target.value); }} />
                            { validations.find((validation) => {return validation.field === "email"}).message !== "" ? <p className="text-red-600">{validations.find((validation) => {return validation.field === "email"}).message}</p> : null }
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white hover:cursor-pointer" type="submit">Send Verification</button>
                    </form>
                : null }
            </div>
        </PageWrapper>
    );
}