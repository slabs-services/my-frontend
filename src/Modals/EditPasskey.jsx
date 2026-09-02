import { useEffect, useState } from "react";
import { updateAlert, updateValidation } from "../Utils";
import { useComponentContext } from "../Contexts/ComponentContext";

export function EditPasskey({ passkeyInfo, updatePasskeyList }) {
    const { setModal, setAlert, setIsLoading } = useComponentContext();
    const [passkeyName, setPasskeyName] = useState("");
    const [validations, setValidations] = useState([
        {
            field: "name",
            message: ""
        }
    ]);

    async function handleSubmit(e){
        e.preventDefault();
        setIsLoading(true);
        setModal(null);
        validations.forEach((validation) => {
            updateValidation(setValidations, validation.field, "");
        });

        if(passkeyName.length < 3){
            updateValidation(setValidations, "name", "Please enter a small name");
            setIsLoading(false);
            return;
        }

        const changePasskey = new URL(
            "/updatePasskey",
            import.meta.env.VITE_MY_API_URL
        );

        try {
            const response = await fetch(changePasskey, {
                method: 'PATCH',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    passkeyName,
                    passkeySrn: passkeyInfo.srn
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
                updatePasskeyList((lastPasskeys) =>
                    lastPasskeys.map((passkey) =>
                        passkey.srn === passkeyInfo.srn ? { ...passkey, name: passkeyName } : passkey
                    )
                );
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

    useEffect(() => {
        setPasskeyName(passkeyInfo.name);
    }, [passkeyInfo]);

    return (
        <div className="w-120">
            <div className="bg-gray-200 p-3">
                <p className="font-bold text-gray-500">Edit Passkey</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="p-4 flex flex-col gap-y-4 min-h-32">
                    <div className="flex flex-col gap-y-1">
                        <label htmlFor="name">Passkey Name</label>
                        <input required type="text" id="name" placeholder="Name" autoComplete="name" autoCorrect="on" autoCapitalize="on" className="p-1 border rounded border-slate-400 outline-none focus:border-blue-600 text-slate-900" value={passkeyName} onChange={(e) => { clearFeedbackErrors(e.target.id); setPasskeyName(e.target.value); }} />
                        { validations.find((validation) => {return validation.field === "name"}).message !== "" ? <p className="text-red-600">{validations.find((validation) => {return validation.field === "name"}).message}</p> : null }
                    </div>
                </div>
                <div className="flex justify-end p-3 bg-gray-200 gap-x-3">
                    <a className="text-gray-500 font-bold hover:text-gray-600 hover:cursor-pointer" onClick={() => { setModal(null); }}>Cancel</a>
                    <button className="text-blue-800 font-bold hover:text-blue-900 hover:cursor-pointer" type="submit">Confirm</button>
                </div>
            </form>
        </div>
    );
}