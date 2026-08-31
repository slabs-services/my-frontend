import { createContext, useContext } from "react";
import useAuth from "../Hooks/useAuth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const auth = useAuth();

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    return context;
}