import React from 'react';
import { useState, createContext, useContext, useEffect, FunctionComponent } from "react";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { FirebaseContextType } from "../interfaces";
import Loading from "../screens/Loading";

// const FirebaseContext = createContext<FirebaseContextType>({
//     user: null,
// });

const FirebaseContext = createContext<any>({
    user: null,
});

export function useFirebaseContext() {
    return useContext(FirebaseContext);
}

export const FirebaseProvider: FunctionComponent<{}> = ({ children }) => {

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [what, setWhat] = useState(null);

    function onAuthStateChanged(user:FirebaseAuthTypes.User | null) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged);
        return unsubscribe; // unsubscribe on unmount
    }, []);

    if (initializing) return <Loading />;

    // const value:FirebaseContextType = {
    //     user
    // }
    const value:any = {
        user,
        what,
        setWhat
    }

    return (
        <FirebaseContext.Provider value={value}>
            {children}
        </FirebaseContext.Provider>
    );
}