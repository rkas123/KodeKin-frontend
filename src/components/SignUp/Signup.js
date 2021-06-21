import {useReducer,useEffect,useState,useContext} from 'react';
import {Redirect} from 'react-router-dom';
import * as api from '../../api/index';
import Message from '../../utils/Message/Message';
import context from '../../contexts/context';
import classes from './SignUp.module.css';

const emailReducer = (state,action) => {
    if(action.type === "USER_INPUT")
        return {value: action.val, isValid: action.val.includes('@')};
    if(action.type === "INPUT_BLUR")
        return {value: state.value, isValid: state.value.includes('@')};
    return {value: state.value, isValid: state.isValid};
}

const passwordReducer = (state,action) => {
    if(action.type === "USER_INPUT")
        return {value: action.val, isValid: action.val.length > 8};
    if(action.type === "INPUT_BLUR")
        return {value: state.value, isValid: state.value.length > 8};
    return {value: state.value, isValid: state.isValid};
}

const usernameReducer = (state,action) => {
    if(action.type === "USER_INPUT")
        return {value: action.val, isValid: action.val.length > 0};
    if(action.type === "INPUT_BLUR")
        return {value: state.value, isValid: state.value.length > 0};
    return {value: state.value, isValid: state.isValid};
}

const SignUp = () => {
    const ctx = useContext(context);

    const[showMessage,setShowMessage] = useState(false);
    
    const [formIsValid, setFormIsValid] = useState(false);

    const [username, dispatchUsername] = useReducer(usernameReducer,{
        value: '',
        isValid: null
    });
    const [emailState, dispatchEmail] = useReducer(emailReducer, {
        value: '',
        isValid: null,
    });

    const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
        value: '',
        isValid: null,
    });

    const emailChangeHandler = (event) => {
        dispatchEmail({ type: 'USER_INPUT', val: event.target.value });
      };
    
    const passwordChangeHandler = (event) => {
        dispatchPassword({ type: 'USER_INPUT', val: event.target.value });
      };
    
    const validateEmailHandler = () => {
        dispatchEmail({ type: 'INPUT_BLUR' });
    };
    
    const validatePasswordHandler = () => {
        dispatchPassword({ type: 'INPUT_BLUR' });
    };
    
    const submitHandler = async (event) => {
        event.preventDefault();
        try{
            await api.signup({username: username.value, email: emailState.value, password: passwordState.value});
            setShowMessage(true);
        }
        catch(error)
        {
            console.log(error);
        }
    };

    const usernameChangeHandler = (event) =>{
        dispatchUsername({type: 'USER_INPUT', val: event.target.value});
    }

    const validateUsernameHandler = () => {
        dispatchUsername({type: 'INPUT_BLUR'});
    }

    useEffect(() => {
        const identifier = setTimeout(() => {
          setFormIsValid(emailState.isValid && passwordState.isValid && username.isValid);
        }, 1000);
    
        return () => {
          clearTimeout(identifier);
        };
      }, [emailState.isValid, passwordState.isValid, username.isValid]);

    if(ctx.isLoggedIn)
    {
        return <Redirect to="/"/>
    }

    if(showMessage)
    {
        return (<Message>
                <h1>Verification Email Sent!</h1>
                <h2>Verify your email and you are good to go! You may close this tab.</h2>
        </Message>);
    }

    return (
        <div className = {classes.login}>
        <form onSubmit = {submitHandler}>

            <div className={`${classes.control} ${
                username.isValid === false ? classes.invalid : ''
            }`}>
            <input id="username"
                type="text"
                value={username.value}
                placeholder={"Enter Username"}
                onChange = {(event) => usernameChangeHandler(event)}
                onBlur = {()=>validateUsernameHandler()}/>
            </div>

            <div className={`${classes.control} ${
                emailState.isValid === false ? classes.invalid : ''
            }`}>
            <input id="email" 
                type="email" 
                value={emailState.value} 
                placeholder ={"Enter Email"}
                onChange = {(event)=>emailChangeHandler(event)}
                onBlur = {()=>validateEmailHandler()}/>
            </div>

            <div className={`${classes.control} ${
                passwordState.isValid === false ? classes.invalid : ''
                }`}>
            <input id="password" 
                type="password" 
                value={passwordState.value} 
                onChange = {(event)=>passwordChangeHandler(event)}
                placeholder = {"Enter Password"}
                onBlur = {()=>validatePasswordHandler()}/>
            </div>
            
            <button onClick ={(event)=> submitHandler(event)}className={`${classes.btn} ${formIsValid && classes.activebtn}`} disabled={!formIsValid} type="submit">Sign Up</button>
        </form>
        </div>
    )
}

export default SignUp;
