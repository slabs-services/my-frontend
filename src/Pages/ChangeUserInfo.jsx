import AlertBox from "../Components/Alert";
import { useComponentContext } from "../Contexts/ComponentContext";
import { useAuthContext } from "../Contexts/AuthContext";
import PageWrapper from "../Components/PageWrapper";
import { updateAlert, updateValidation } from "../Utils";
import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ChangeUserInfo() {
    const navigate = useNavigate();
    const { alert, setIsLoading, setAlert } = useComponentContext();
    const { userInfo, setUserInfo } = useAuthContext();
    const [name, setName] = useState("");
    const [validations, setValidations] = useState([
        {
            field: "name",
            message: ""
        }
    ]);

    useEffect(() => {
        updateAlert(setAlert, "hideContent", false);
        updateAlert(setAlert, "showAlert", false);
        setIsLoading(false);
        setName(userInfo.name);
    }, [userInfo]);

    async function handleSubmit(e){
        e.preventDefault();
        setIsLoading(true);
        validations.forEach((validation) => {
            updateValidation(setValidations, validation.field, "");
        });

        if(name.length < 3){
            updateValidation(setValidations, "name", "Name must be 3+ characters");
            setName('');
            setIsLoading(false);
            return;
        }

        const changeBasicInfo = new URL(
            "/changeBasicInfo",
            import.meta.env.VITE_MY_API_URL
        );

        try {
            const response = await fetch(changeBasicInfo, {
                method: 'POST',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name
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
                updateAlert(setAlert, "hideContent", true);
                setIsLoading(false);
                setUserInfo((lastInfo) => {
                    return {
                        ...lastInfo,
                        name
                    }
                });
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
                <h1 className="text-3xl font-bold text-zinc-700">Change Basic Information</h1>
            </div>
            <div className="mt-6 gap-y-2 flex flex-col p-4 bg-white shadow">
                <AlertBox alert={alert} className="w-125" />
                { !alert.hideContent ?
                    <form className="flex flex-col gap-y-4 w-125" onSubmit={handleSubmit}>
                        <p>Do you want to change your basic information? Let's start</p>
                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="name">Name</label>
                            <input required type="text" id="name" placeholder="Your Name" autoComplete="name" autoCorrect="on" autoCapitalize="on" className="p-1 border rounded border-slate-400 outline-none focus:border-blue-600 text-slate-900" value={name} onChange={(e) => { clearFeedbackErrors(e.target.id); setName(e.target.value); }} />
                            { validations.find((validation) => {return validation.field === "name"}).message !== "" ? <p className="text-red-600">{validations.find((validation) => {return validation.field === "name"}).message}</p> : null }
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white hover:cursor-pointer" type="submit">Change Information</button>
                    </form>
                : null }
            </div>
        </PageWrapper>
    );
}