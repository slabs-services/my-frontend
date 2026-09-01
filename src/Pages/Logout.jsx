import { useEffect } from "react";
import AlertBox from "../Components/Alert";
import { updateAlert } from "../Utils";
import PageWrapper from "../Components/PageWrapper";
import { useNavigate } from "react-router-dom";
import { useComponentContext } from "../Contexts/ComponentContext";
import { ConfirmModal } from "../Modals/Confirm";
import { useAuthContext } from "../Contexts/AuthContext";

export default function Logout() {
    const navigate = useNavigate();
    const { alert, setAlert, setIsLoading, setModal } = useComponentContext();
    const { logout } = useAuthContext();

    useEffect(() => {
        setModal(<ConfirmModal actionCancel={() => { setModal(null); navigate("/my"); }} actionConfirm={() => { logout(); }} contentText="Are you sure you want to logout?" headerText="Confirm Logout" />);
        updateAlert(setAlert, "hideContent", true);
        updateAlert(setAlert, "showAlert", false);
        setIsLoading(false);
    }, []);

    return(
        <PageWrapper>
            <h1 className="text-3xl font-bold text-zinc-700">Logout</h1>
            <div className="mt-6 w-125 gap-y-2 flex flex-col">
                <AlertBox alert={alert} />
                { !alert.hideContent ?
                    <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white hover:cursor-pointer" onClick={() => { navigate("/my") }}>Log in again</button>
                : null }
            </div>
        </PageWrapper>
    );
}