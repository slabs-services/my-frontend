import AlertBox from "../Components/Alert";
import { useComponentContext } from "../Contexts/ComponentContext";
import PageWrapper from "../Components/PageWrapper";
import { useNavigate } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { TbPasswordFingerprint } from "react-icons/tb";
import { MdAlternateEmail, MdOutlineDisabledByDefault } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { GoPasskeyFill } from "react-icons/go";
import { useEffect } from "react";
import { updateAlert } from "../Utils";

export default function Settings() {
    const navigate = useNavigate();
    const { alert, setAlert, setIsLoading } = useComponentContext();

    useEffect(() => {
        updateAlert(setAlert, "showAlert", false);
        updateAlert(setAlert, "hideContent", false);
        setIsLoading(false);
    }, []);

    return (
        <PageWrapper>
            <h1 className="text-3xl font-bold text-zinc-700">Settings</h1>
            <div className="mt-6 gap-y-2 flex flex-col">
                <AlertBox alert={alert} />
                { !alert.hideContent ?
                    <>
                        <div class="grid grid-cols-4 gap-4">
                            <div className="p-4 bg-white shadow flex flex-col justify-center items-center gap-y-2">
                                <RiLockPasswordFill className="w-24 h-24 text-zinc-700" />
                                <p className="text-zinc-700">Change Password</p>
                                <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white hover:cursor-pointer w-full" onClick={() => { navigate("/change-password"); }}>Change</button>
                            </div>
                            <div className="p-4 bg-white shadow flex flex-col justify-center items-center gap-y-2">
                                <TbPasswordFingerprint className="w-24 h-24 text-zinc-700" />
                                <p className="text-zinc-700">Change MFA</p>
                                <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white hover:cursor-pointer w-full" onClick={() => { navigate("/change-mfa"); }}>Change</button>
                            </div>
                            <div className="p-4 bg-white shadow flex flex-col justify-center items-center gap-y-2">
                                <MdAlternateEmail className="w-24 h-24 text-zinc-700" />
                                <p className="text-zinc-700">Change Email</p>
                                <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white hover:cursor-pointer w-full" onClick={() => { navigate("/change-email"); }}>Change</button>
                            </div>
                            <div className="p-4 bg-white shadow flex flex-col justify-center items-center gap-y-2">
                                <FaUser className="w-24 h-24 text-zinc-700" />
                                <p className="text-zinc-700">Change User Info</p>
                                <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white hover:cursor-pointer w-full" onClick={() => { navigate("/change-basicinfo"); }}>Change</button>
                            </div>
                            <div className="p-4 bg-white shadow flex flex-col justify-center items-center gap-y-2">
                                <MdOutlineDisabledByDefault className="w-24 h-24 text-zinc-700" />
                                <p className="text-zinc-700">Disable Account</p>
                                <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white hover:cursor-pointer w-full" onClick={() => { navigate("/disable-account"); }}>Disable</button>
                            </div>
                            <div className="p-4 bg-white shadow flex flex-col justify-center items-center gap-y-2">
                                <GoPasskeyFill className="w-24 h-24 text-zinc-700" />
                                <p className="text-zinc-700">Manage Passkeys</p>
                                <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white hover:cursor-pointer w-full" onClick={() => {  }}>Manage</button>
                            </div>
                        </div>
                    </>
                : null }
            </div>
        </PageWrapper>
    );
}