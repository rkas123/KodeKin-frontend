import {useReducer,useEffect,useState,useContext} from 'react';
import context from '../../contexts/context';
import classes from './Login.module.css';
import {useHistory,Redirect} from 'react-router-dom';


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


const Login = () => {
    const history = useHistory();
    const ctx = useContext(context);
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
    
    const submitHandler = async (event) => {
        event.preventDefault();
        try{
            const data = await ctx.onLogIn({email: emailState.value, password: passwordState.value});
            if(data)
            {
                console.log("redirecting");
                history.replace("/");
            }
            else
            {
                console.log("Invalid Credentials");
            }
        }
        catch(error)
        {
            console.log(error);
        }
        
    };

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
    return (
        <div className = {classes.login}>
        <form onSubmit = {submitHandler}>

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
            <div className={classes.links}>
                <a href="/forgotPassword">Forgot Password?</a>
                <a href="/signup">New User? Click to Sign Up</a>
            </div>
            <button className={`${classes.btn} ${formIsValid && classes.activebtn}`} disabled={!formIsValid} type="submit">Login</button>
        </form>
        </div>
    )
}

export default Login;