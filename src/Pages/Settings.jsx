import AlertBox from "../Components/Alert";
import { useComponentContext } from "../Contexts/ComponentContext";
import PageWrapper from "../Components/PageWrapper";
import { useNavigate } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { TbPasswordFingerprint } from "react-icons/tb";
import { MdAlternateEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { GoPasskeyFill } from "react-icons/go";

export default function Settings() {
    const navigate = useNavigate();
    const { alert } = useComponentContext();

    return (
        <PageWrapper>
            <AlertBox alert={alert} />
            { !alert.hideContent ?
                <div>
                    <h1 className="text-3xl font-bold text-zinc-700">Settings</h1>
                    <div class="grid grid-cols-4 gap-4 mt-4">
                        <div className="p-4 bg-white shadow flex flex-col justify-center items-center gap-y-2">
                            <RiLockPasswordFill className="w-24 h-24 text-zinc-700" />
                            <p className="text-zinc-700">Change Password</p>
                            <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white hover:cursor-pointer w-full" onClick={() => {  }}>Change</button>
                        </div>
                        <div className="p-4 bg-white shadow flex flex-col justify-center items-center gap-y-2">
                            <TbPasswordFingerprint className="w-24 h-24 text-zinc-700" />
                            <p className="text-zinc-700">Change MFA</p>
                            <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white hover:cursor-pointer w-full" onClick={() => {  }}>Change</button>
                        </div>
                        <div className="p-4 bg-white shadow flex flex-col justify-center items-center gap-y-2">
                            <MdAlternateEmail className="w-24 h-24 text-zinc-700" />
                            <p className="text-zinc-700">Change Email</p>
                            <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white hover:cursor-pointer w-full" onClick={() => { navigate("/change-email"); }}>Change</button>
                        </div>
                        <div className="p-4 bg-white shadow flex flex-col justify-center items-center gap-y-2">
                            <FaUser className="w-24 h-24 text-zinc-700" />
                            <p className="text-zinc-700">Change User Info</p>
                            <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white hover:cursor-pointer w-full" onClick={() => {  }}>Change</button>
                        </div>
                        <div className="p-4 bg-white shadow flex flex-col justify-center items-center gap-y-2">
                            <GoPasskeyFill className="w-24 h-24 text-zinc-700" />
                            <p className="text-zinc-700">Manage Passkeys</p>
                            <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white hover:cursor-pointer w-full" onClick={() => {  }}>Manage</button>
                        </div>
                    </div>
                </div>
            : null }
        </PageWrapper>
    );
}