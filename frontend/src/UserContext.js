import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 
    
    useEffect(() => {
        fetch('http://127.0.0.1:5000/profile', {
            credentials: 'include',
        })
        .then(res => {
            res.json().then(userInfo => {
                console.log("User info:", userInfo);
                setUserInfo(userInfo);
                setIsLoading(false); 
            });
        })
        .catch(error => {
            console.error("Fetch error:", error);
            setIsLoading(false); 
        });
    }, []);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, isLoading }}>
            {children}
        </UserContext.Provider>
    );
}