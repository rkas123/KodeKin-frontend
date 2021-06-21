import { useState,useEffect } from 'react';
import IconButton from '@material-ui/core/Button'
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import classes from './AddFriend.module.css';

const AddFriend = (props) => {
    const [name,setName] = useState("");
    const [valid,setValid] = useState(false);
    const {addFriendHandler,cancelHandler} = props;

    const onChangeHandler = (event) => {
        setName(event.target.value);
    }
    useEffect(()=>{
        if(name.length > 0)
            setValid(true);
        else
            setValid(false);
    },[name]);

    return (
        <div className = {classes.container}>
            <input  className={classes.Input} value = {name} onChange = {(event)=>onChangeHandler(event)} placeholder="Enter Name"/>
            <IconButton disabled ={!valid} onClick = {()=> addFriendHandler(name)}><CheckIcon/></IconButton>
            <IconButton onClick = {()=>cancelHandler()}><CancelIcon/></IconButton>
        </div>
    )
}

export default AddFriend;