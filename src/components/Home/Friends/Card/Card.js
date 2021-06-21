import { useState } from 'react';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import classes from './Card.module.css';
import AddLink from '../AddLink/AddLink';
import EditCard from '../EditCard/EditCard';
import * as api from '../../../../api/index';

const Card = (props) => {
    const[hover,setHover] = useState(false);
    const{name,resources} = props.friend;
    const[displayLinks,setDisplayLinks] = useState(true);
    const [addResource,setAddResource] = useState(false);
    const data = resources.map((resource,idx) => {
        return (
            <p className={classes.res} key={`${name}${resource.link}${idx}`}><a target = "_blank" href={resource.link}>{resource.platform}</a></p>
        );
    });
    const submitHandler = async (platform,link) => {
        const data = {
            resource:{
                platform: platform,
                link: link
            },
            index: props.index,
        }
        try{
            await api.addresource(data);
            props.forceReload();
        }
        catch(error){
            console.log(error);
        }
        setAddResource(false);
    }
    const cancelHandler = () => {   
        setAddResource(false);
    }

    const editClickHandler = () => {
        setDisplayLinks((prevState)=> !prevState);
    }

    const editCancelHandler = () => {
        setDisplayLinks(true);
    }

    const submitEditHandler = async(data,index) => {
        try{
            await props.editFriend(data,index);
        }
        catch(error)
        {
            console.log(error);
        }
        setDisplayLinks(true);
    }

    return(
        <div className={classes.card} onMouseOver={()=>{setHover(true)}} onMouseLeave={()=>{setHover(false)}}>
            <h3>{props.friend.name}<IconButton onClick = {()=> editClickHandler() }><EditIcon/></IconButton></h3>
            {hover && <div className={classes.closebtn}><IconButton onClick={props.deleteFriendHandler}><CloseIcon/></IconButton></div>}
            { displayLinks === true ? 
                <div className= {classes.list}>
                    {data}
                    {!addResource ? 
                        <button onClick={()=>{setAddResource(true)}} className={classes.btn}>+</button>
                        :
                        <AddLink submitHandler={submitHandler} cancelHandler={cancelHandler}/>} 
                </div>
                : 
                <EditCard index={props.index} cancelHandler = {editCancelHandler} submitHandler={submitEditHandler} friend={props.friend}/>
            }

        </div>
    );
}

export default Card;