import AlertBox from "../Components/Alert";
import { useComponentContext } from "../Contexts/ComponentContext";
import PageWrapper from "../Components/PageWrapper";

export default function Apps() {
    const { alert } = useComponentContext();

    return (
        <PageWrapper>
            <AlertBox alert={alert} />
            { !alert.hideContent ? <h1 className="text-3xl font-bold text-zinc-700">My Apps</h1> : null }
        </PageWrapper>
    );
}