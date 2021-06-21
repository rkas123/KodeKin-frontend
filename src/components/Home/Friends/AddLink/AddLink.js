import {useState,useEffect} from 'react';

import IconButton from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import classes from './AddLink.module.css';

const AddLink = (props) => {
    const {submitHandler,cancelHandler} = props;

    const [platform,setPlatform] = useState("");
    const [link,setLink] = useState("");
    const [valid,setValid] = useState(false);

    const platformChangeHandler = (event) => {
        setPlatform(event.target.value);
    }

    const linkChangeHandler = (event) => {
        setLink(event.target.value);
    }

    useEffect(()=>{
        if(platform.length > 0)
            setValid(true);
        else
            setValid(false);
    },[platform])

    return (
        <div className={classes.container}>
            <input value = {platform} onChange = {(event)=> platformChangeHandler(event)} className={classes.Input} placeholder="Platform"></input>
            <input value = {link} onChange = {(event)=> linkChangeHandler(event)} className={classes.Input} placeholder="Paste Link"></input>
            <div className={classes.buttons}>
            <IconButton disabled={!valid}  onClick = {()=> submitHandler(platform,link)} color="primary" aria-label="upload picture" component="span">
                <CheckIcon />
            </IconButton>
            <IconButton onClick = {()=> cancelHandler()} color="primary" aria-label="upload picture" component="span">
                <CancelIcon />
            </IconButton>
            </div>
            
        </div>
    )
}

export default AddLink;