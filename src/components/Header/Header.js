import React, {useContext, useEffect} from 'react';
import classes from './Header.module.css';
import { useHistory } from 'react-router';
import context from '../../contexts/context.js';

const Header = () => {
    let history = useHistory();
    const ctx = useContext(context);
    
    const onButtonClickHandler = () =>{
        history.push("/login");
    }

    const onLogoutButtonClickHandler = () =>{
        localStorage.clear();
        ctx.setIsLoggedIn(false);
        history.push("/login");
    }

    const redirectHandler = () => {
        history.push("/");
    }

    useEffect(()=>{
        if(localStorage.getItem('profile'))
        {
            ctx.setIsLoggedIn(true);
        }

    },[])

    

    return (
    <div className = {classes.header}>
        <h2 onClick = {()=> redirectHandler()} className={classes.title}>KodeKin</h2>
        { (ctx.isLoggedIn === false) ? 
            <button onClick ={()=>onButtonClickHandler()} className={classes.btn}>Login</button>
            :
            <button onClick ={()=>onLogoutButtonClickHandler()} className = {classes.btn}>Logout</button>}
        
    </div>
    );

}

export default Header;