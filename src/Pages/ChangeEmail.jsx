import AlertBox from "../Components/Alert";
import { useComponentContext } from "../Contexts/ComponentContext";
import { useAuthContext } from "../Contexts/AuthContext";
import PageWrapper from "../Components/PageWrapper";
import { updateValidation } from "../Utils";
import { useState, useEffect } from "react";

export default function ChangeEmail() {
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
        setEmail(userInfo.email);
    }, [userInfo]);

    async function handleSubmit(e){
        e.preventDefault();
        setIsLoading(true);
        validations.forEach((validation) => {
            updateValidation(setValidations, validation.field, "");
        });
    }

    function clearFeedbackErrors(field) {
        updateValidation(setValidations, field, "");
        updateAlert(setAlert, "showAlert", false);
    }

    return (
        <PageWrapper>
            <AlertBox alert={alert} />
            { !alert.hideContent ?
                <div>
                    <h1 className="text-3xl font-bold text-zinc-700">Change Email</h1>
                    <form className="flex flex-col mt-6 gap-y-4 w-2/5" onSubmit={handleSubmit}>
                        <p>Do you want to change your email? Let's start</p>
                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="email">Email address</label>
                            <input required type="email" id="email" placeholder="example@domain.com" autoComplete="email" autoCorrect="off" autoCapitalize="off" className="p-1 border rounded border-slate-400 outline-none focus:border-blue-600 text-slate-900" value={email} onChange={(e) => { clearFeedbackErrors(e.target.id); setEmail(e.target.value); }} />
                            { validations.find((validation) => {return validation.field === "email"}).message !== "" ? <p className="text-red-600">{validations.find((validation) => {return validation.field === "email"}).message}</p> : null }
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white hover:cursor-pointer" type="submit">Send Verification</button>
                    </form>
                </div>
            : null }
        </PageWrapper>
    );
}