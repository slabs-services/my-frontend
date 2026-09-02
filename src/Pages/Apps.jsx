import AlertBox from "../Components/Alert";
import { useComponentContext } from "../Contexts/ComponentContext";
import PageWrapper from "../Components/PageWrapper";
import { useEffect } from "react";
import { updateAlert } from "../Utils";

export default function Apps() {
    const { alert, setAlert, setIsLoading } = useComponentContext();

    useEffect(() => {
        updateAlert(setAlert, "showAlert", false);
        updateAlert(setAlert, "hideContent", false);
        setIsLoading(false);
    }, []);

    return (
        <PageWrapper>
            <h1 className="text-3xl font-bold text-zinc-700">My Apps</h1>
            <div className="mt-6 gap-y-2 flex flex-col">
                <AlertBox alert={alert} className="w-full" />
                { !alert.hideContent ? <h1>Conteudo Teste</h1> : null }
            </div>
        </PageWrapper>
    );
}