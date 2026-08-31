import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Home from "./Pages/Home";
import OAuth from "./Pages/OAuth";

export default function Router(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/my" replace />} />
                <Route path="/my" element={<Home />} />
                <Route path="/oauth" element={<OAuth />} />
            </Routes>
        </BrowserRouter>
    );
}