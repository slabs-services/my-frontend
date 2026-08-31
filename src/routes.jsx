import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./Contexts/AuthContext";
import { ComponentProvider } from "./Contexts/ComponentContext";

import Apps from "./Pages/Apps";
import OAuth from "./Pages/OAuth";
import Settings from "./Pages/Settings";
import ChangeEmail from "./Pages/ChangeEmail";

export default function Router(){
    return (
        <BrowserRouter>
            <ComponentProvider>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Navigate to="/my" replace />} />
                        <Route path="/my" element={<Apps />} />
                        <Route path="/oauth" element={<OAuth />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/change-email" element={<ChangeEmail />} />
                    </Routes>
                </AuthProvider>
            </ComponentProvider>
        </BrowserRouter>
    );
}