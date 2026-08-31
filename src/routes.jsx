import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./Contexts/AuthContext";

import Apps from "./Pages/Apps";
import OAuth from "./Pages/OAuth";
import Settings from "./Pages/Settings";

export default function Router(){
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Navigate to="/my" replace />} />
                    <Route path="/my" element={<Apps />} />
                    <Route path="/oauth" element={<OAuth />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}