import React from 'react';
import { useState, createContext, useContext, useEffect, FunctionComponent } from "react";
import { FirebaseContextType } from "../interfaces";
import Loading from "../screens/Loading";

const AuthContext = createContext<any>(null);

export function useAuthContext() {
    return useContext(AuthContext);
}

export const AuthProvider: FunctionComponent<{}> = ({ children }) => {

    const [auth, setAuth] = useState(null);
    const value:any = {
        auth,
        setAuth,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}