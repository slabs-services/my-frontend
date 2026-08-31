import { useEffect } from "react";
import { useAuthContext } from "../Contexts/AuthContext";
import { FaPowerOff, FaGear } from "react-icons/fa6";
import { useNavigate, Link } from "react-router-dom";

export default function PageWrapper({ children, ignoreLocalAuth = false }) {
    const { getUserInfo, name, isLoading, isAuthenticated } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if(!ignoreLocalAuth){
            getUserInfo();
        }
    }, [ignoreLocalAuth]);

    return (
        <div className="bg-gray-50 w-full h-full absolute flex items-center flex-col font-roboto">
            { isLoading ? <div className="w-full h-full absolute bg-black/50 flex items-center justify-center">
                <img src="/loading.svg" title="Loading" alt="Loading" className="w-16 animate-spin" />
            </div> : null }
            <div className="bg-[#252f3d] w-full p-3 flex justify-center">
                <div className="w-2/3 flex justify-between">
                    <img src="/logo-big.svg" title="Logo" alt="Logo" className="h-6" />
                    { isAuthenticated ? <div className="flex gap-x-2 items-center">
                        <p className="text-white opacity-80">{name}</p>
                        <Link to="/settings" className="text-white">Settings</Link>
                        <Link to="/" className="text-white">Log out</Link>
                    </div> : null }
                </div>
            </div>
            <div className="w-full p-3 flex justify-center">
                <div className="w-2/3">
                    { children }
                </div>
            </div>
        </div>
    );
}