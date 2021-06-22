import React, {useState} from 'react';
import * as api from "../api/index";

const context = React.createContext({
    isLoggedIn : false,
    showModal : false,
    listOfFriends : [],
    onLogOut: () => {},
    onLogIn: async (userData) => {},
    setIsLoggedIn: (val) => {}
});

export const ContextProvider = (props) => {
    const [isLoggedIn,setIsLoggedIn] = useState(false);

    const logoutHandler = () => {
        localStorage.clear();
        setIsLoggedIn(false);
    }

    const loginHandler = async (userData) => {
        try{
            const data = await api.signin(userData);
            localStorage.setItem("profile",JSON.stringify(data.data));
            setLogin(true);
            return new Promise((resolve,reject) => resolve(true));
        }
        catch(error)
        {
            return new Promise((reject,resolve) => reject(false));
        }
    }

    const setLogin = (val) => {
        setIsLoggedIn(val);
    }
    return (
        <context.Provider 
            value={{
                setIsLoggedIn: setLogin,
                isLoggedIn: isLoggedIn,
                onLogIn: loginHandler,
                onLogOut: logoutHandler,
            }}
        >{props.children}
        </context.Provider>
    )
}

export default context;