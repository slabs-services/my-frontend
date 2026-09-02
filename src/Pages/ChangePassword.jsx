import AlertBox from "../Components/Alert";
import { useComponentContext } from "../Contexts/ComponentContext";
import PageWrapper from "../Components/PageWrapper";
import { updateAlert, updateValidation } from "../Utils";
import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
    const navigate = useNavigate();
    const { alert, setIsLoading, setAlert } = useComponentContext();
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [validations, setValidations] = useState([
        {
            field: "password",
            message: ""
        },
        {
            field: "repassword",
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

        if(password.length < 8){
            updateValidation(setValidations, "password", "Password must be 8+ characters");
            setPassword('');
            setRepassword('');
            setIsLoading(false);
            return;
        }

        if(password !== repassword){
            updateValidation(setValidations, "repassword", "Passwords not match");
            setPassword('');
            setRepassword('');
            setIsLoading(false);
            return;
        }

        const changePassword = new URL(
            "/changePassword",
            import.meta.env.VITE_MY_API_URL
        );

        try {
            const response = await fetch(changePassword, {
                method: 'PATCH',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    password
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
                <h1 className="text-3xl font-bold text-zinc-700">Change Password</h1>
            </div>
            <div className="mt-6 gap-y-2 flex flex-col p-4 bg-white shadow">
                <AlertBox alert={alert} className="w-125" />
                { !alert.hideContent ?
                    <form className="flex flex-col gap-y-4 w-125" onSubmit={handleSubmit}>
                        <p>Do you want to change your password? Let's start</p>
                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="password">Password</label>
                            <input required type="password" id="password" autoComplete="new-password" placeholder="••••••••" autoCorrect="off" autoCapitalize="off" className="p-1 border rounded border-slate-400 outline-none focus:border-blue-600 text-slate-900" value={password} onChange={(e) => { clearFeedbackErrors(e.target.id); setPassword(e.target.value); }} />
                            { validations.find((validation) => {return validation.field === "password"}).message !== "" ? <p className="text-red-600">{validations.find((validation) => {return validation.field === "password"}).message}</p> : null }
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="repassword">Repeat Password</label>
                            <input required type="password" id="repassword" autoComplete="new-password" placeholder="••••••••" autoCorrect="off" autoCapitalize="off" className="p-1 border rounded border-slate-400 outline-none focus:border-blue-600 text-slate-900" value={repassword} onChange={(e) => { clearFeedbackErrors(e.target.id); setRepassword(e.target.value); }} />
                            { validations.find((validation) => {return validation.field === "repassword"}).message !== "" ? <p className="text-red-600">{validations.find((validation) => {return validation.field === "repassword"}).message}</p> : null }
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white hover:cursor-pointer" type="submit">Change Password</button>
                    </form>
                : null }
            </div>
        </PageWrapper>
    );
}