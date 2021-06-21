import { useReducer,useEffect,useState, useContext } from "react";
import context from "../../contexts/context";
import classes from './Password.module.css';
import { Redirect } from "react-router";
import Message from "../../utils/Message/Message";
import * as api from '../../api/index';

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


const Password = () =>{
    const ctx = useContext(context);

    const [showMessage,setShowMessage] = useState(false);

    const [formIsValid, setFormIsValid] = useState(false);

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

    const submitHandler = async(event) => {
        event.preventDefault();
        try
        {
            await api.forgotpassword({email: emailState.value, password: passwordState.value});
            setShowMessage(true);
        }
        catch(error)
        {
            console.log(error);
        }
    }

    useEffect(() => {
        const identifier = setTimeout(() => {
          setFormIsValid(emailState.isValid && passwordState.isValid);
        }, 1000);
    
        return () => {
          clearTimeout(identifier);
        };
      }, [emailState.isValid, passwordState.isValid]);

    if(ctx.isLoggedIn)
    {
        return <Redirect to ="/"/>
    }

    if(showMessage)
    {
        return <Message>
            <div className = {classes.login}>
                <h1>Verification Email sent!</h1>
                <h3>You may close this tab.</h3>
            </div>
        </Message>
    }
    
    return(
        <div className={classes.login}>
            <form onSubmit = {(event)=>submitHandler(event)}>
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
                    placeholder = {"Enter Your New Password"}
                    onBlur = {()=>validatePasswordHandler()}/>
                </div>
                <button className={`${classes.btn} ${formIsValid && classes.activebtn}`} disabled={!formIsValid} type="submit">Submit</button>
            </form>
        </div>
    )
}

export default Password;