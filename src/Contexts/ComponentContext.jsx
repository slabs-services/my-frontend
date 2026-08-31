import { createContext, useContext } from "react";
import useComponent from "../Hooks/useComponent";

const ComponentContext = createContext(null);

export function ComponentProvider({ children }) {
    const component = useComponent();

    return (
        <ComponentContext.Provider value={component}>
            {children}
        </ComponentContext.Provider>
    );
}

export function useComponentContext() {
    const context = useContext(ComponentContext);
    return context;
}