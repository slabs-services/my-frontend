import AlertBox from "../Components/Alert";
import { useComponentContext } from "../Contexts/ComponentContext";
import PageWrapper from "../Components/PageWrapper";
import { formatPTDate, updateAlert } from "../Utils";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { startRegistration } from "@simplewebauthn/browser";
import { ConfirmModal } from "../Modals/Confirm";
import { EditPasskey } from "../Modals/EditPasskey";

export default function ManagePasskeys() {
    const navigate = useNavigate();
    const { alert, setIsLoading, setAlert, setModal } = useComponentContext();
    const [passkeysList, setPasskeysList] = useState([]);

    useEffect(() => {
        async function GetPasskeysConfig(){
            updateAlert(setAlert, "hideContent", true);
            updateAlert(setAlert, "showAlert", false);
            setIsLoading(false);

            try {
                const getAllpasskeys = new URL(
                    "/myPasskeys",
                    import.meta.env.VITE_MY_API_URL
                );

                const response = await fetch(getAllpasskeys, {
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

                updateAlert(setAlert, "hideContent", false);
                setPasskeysList(data);
            } catch (e) {
                updateAlert(setAlert, "severity", 3);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", "Unable to connect to the my service.");
                setIsLoading(false);
            }
        }
        GetPasskeysConfig();
    }, []);

    async function handleAddPasskey() {
        setIsLoading(true);
        try {
            const passkeysConfig = new URL(
                "/passkeyOptions",
                import.meta.env.VITE_MY_API_URL
            );

            const response = await fetch(passkeysConfig, {
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

            try {
                const registerPasskey = await startRegistration({ optionsJSON: data.options });
                await savePasskey(data.srnValidation, registerPasskey);
            }catch(passkeyError){
                if (passkeyError.name === "NotAllowedError") {
                    setIsLoading(false);
                    return;
                }
                if (passkeyError.name === "InvalidStateError") {
                    updateAlert(setAlert, "severity", 2);
                    updateAlert(setAlert, "showAlert", true);
                    updateAlert(setAlert, "message", "This passkey is already registered.");
                    setIsLoading(false);
                    return;
                }
                updateAlert(setAlert, "severity", 3);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", "Unknown Error with passkey");
                setIsLoading(false);
            }
        } catch (e) {
            updateAlert(setAlert, "severity", 3);
            updateAlert(setAlert, "showAlert", true);
            updateAlert(setAlert, "message", "Unable to connect to the my service.");
            setIsLoading(false);
        }
    }

    async function savePasskey(srnValidation, registerPasskey){
        try {
            const savePasskeysConfig = new URL(
                "/savePasskey",
                import.meta.env.VITE_MY_API_URL
            );

            const responseSave = await fetch(savePasskeysConfig, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    passkeyValidationSrn: srnValidation,
                    passkeyBody: registerPasskey
                })
            });

            if (responseSave.status === 502) {
                updateAlert(setAlert, "severity", 3);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", "My service is temporarily unavailable.");
                setIsLoading(false);
                return;
            }

            let data = null;

            try {
                data = await responseSave.json();
            } catch (e) {
                updateAlert(setAlert, "severity", 3);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", "Unknown Error");
                setIsLoading(false);
                return;
            }

            if (!responseSave.ok) {
                updateAlert(setAlert, "severity", data.severity);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", data.message);
                updateAlert(setAlert, "hideContent", data.hideContent);
                setIsLoading(false);
                return;
            }

            updateAlert(setAlert, "severity", 1); 
            updateAlert(setAlert, "showAlert", true);
            updateAlert(setAlert, "message", data.message);
            setIsLoading(false);
            setPasskeysList((lastPasskeys) => [
                ...lastPasskeys,
                {
                    srn: data.passKeySrn,
                    name: data.passkeyName,
                    createdAt: data.createdAt,
                    lastUsage: null
                }
            ]);

            setTimeout(() => {
                updateAlert(setAlert, "showAlert", false);
            }, 2000)
        } catch (e) {
            updateAlert(setAlert, "severity", 3);
            updateAlert(setAlert, "showAlert", true);
            updateAlert(setAlert, "message", "Unable to connect to the my service.");
            setIsLoading(false);
        }
    }

    async function DeletePasskeyConfirm(passkey){
        setModal(null);
        setIsLoading(true);
        try {
            const deletePasskey = new URL(
                "/deletePasskey",
                import.meta.env.VITE_MY_API_URL
            );

            const responseSave = await fetch(deletePasskey, {
                credentials: 'include',
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    passkeySrn: passkey.srn
                })
            });

            if (responseSave.status === 502) {
                updateAlert(setAlert, "severity", 3);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", "My service is temporarily unavailable.");
                setIsLoading(false);
                return;
            }

            let data = null;

            try {
                data = await responseSave.json();
            } catch (e) {
                updateAlert(setAlert, "severity", 3);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", "Unknown Error");
                setIsLoading(false);
                return;
            }

            if (!responseSave.ok) {
                updateAlert(setAlert, "severity", data.severity);
                updateAlert(setAlert, "showAlert", true);
                updateAlert(setAlert, "message", data.message);
                updateAlert(setAlert, "hideContent", data.hideContent);
                setIsLoading(false);
                return;
            }

            updateAlert(setAlert, "severity", 1); 
            updateAlert(setAlert, "showAlert", true);
            updateAlert(setAlert, "message", data.message);
            setIsLoading(false);
            setPasskeysList((lastPasskeys) =>
                lastPasskeys.filter((passkeyItem) => passkeyItem.srn !== passkey.srn)
            );

            setTimeout(() => {
                updateAlert(setAlert, "showAlert", false);
            }, 2000)
        } catch (e) {
            updateAlert(setAlert, "severity", 3);
            updateAlert(setAlert, "showAlert", true);
            updateAlert(setAlert, "message", "Unable to connect to the my service.");
            setIsLoading(false);
        }
    }

    function openPopupPasskeyDelete(passkey){
        setModal(<ConfirmModal actionCancel={() => { setModal(null); }} actionConfirm={() => { DeletePasskeyConfirm(passkey); }} contentText={"Are you sure you want to delete " + passkey.name + " passkey?"} headerText="Confirm Passkey Delete" />);
    }

    function openPopupPasskeyEdit(passkey){
        setModal(<EditPasskey passkeyInfo={passkey} updatePasskeyList={setPasskeysList} />);
    }

    return (
        <PageWrapper>
            <div className="flex items-center gap-x-4">
                <FaArrowLeft className="w-6 h-6 text-zinc-700 hover:cursor-pointer" onClick={() => { navigate("/settings"); }} />
                <h1 className="text-3xl font-bold text-zinc-700">Manage Passkeys</h1>
            </div>
            <div className="mt-6 gap-y-2 flex flex-col p-4 bg-white shadow">
                <AlertBox alert={alert} className="w-125" />
                { !alert.hideContent ?
                    <div className="flex flex-col gap-y-2">
                        <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white hover:cursor-pointer w-36" onClick={() => { handleAddPasskey(); }}>Add Passkey</button>
                        { passkeysList.length !== 0 ? <>
                            <p className="font-bold text-zinc-700">List of your passkeys</p>
                            <table>
                                <thead className="text-slate-900 text-left text-sm font-semibold border-b border-slate-300">
                                    <tr>
                                        <th scope="col" className="px-2 py-2">Name</th>
                                        <th scope="col" className="px-2 py-2">Last Usage</th>
                                        <th scope="col" className="px-2 py-2">Created At</th>
                                        <th scope="col" className="px-2 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {passkeysList.map((passkey) => (
                                        <tr key={passkey.srn} className="even:bg-slate-50">
                                            <td className="px-2 py-2 font-medium text-slate-900">{passkey.name}</td>
                                            <td className="px-2 py-2 text-slate-500">{passkey.lastUsage ? formatPTDate(new Date(passkey.lastUsage), true) : "-" }</td>
                                            <td className="px-2 py-2 text-slate-500">{formatPTDate(new Date(passkey.createdAt), true)}</td>
                                            <td className="px-2 py-2 flex gap-3">
                                                <button className="p-2 bg-slate-200 hover:bg-slate-300 hover:cursor-pointer rounded" onClick={() => { openPopupPasskeyEdit(passkey); }}>
                                                    <FaPencilAlt className="w-4 h-4 text-zinc-700" />
                                                </button>
                                                <button className="p-2 bg-slate-200 hover:bg-slate-300 hover:cursor-pointer rounded" onClick={() => { openPopupPasskeyDelete(passkey); }}>
                                                    <FaTrashAlt className="w-4 h-4 text-zinc-700" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </> : <p className="font-bold text-zinc-700">You don't have any passkeys yet</p> }
                    </div>
                : null }
            </div>
        </PageWrapper>
    );
}