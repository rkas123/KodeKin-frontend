import {useState} from 'react';
import classes from './EditCard.module.css';

const EditCard = (props) => {
    const {submitHandler,index,cancelHandler} = props;
    const [data,setData] = useState(props.friend);
    const nameChangeHandler = (event) =>{
        let temp = {...data};
        temp.name = event.target.value;
        setData(temp);
    }

    const platformChangeHandler = (event,idx) =>{
        let temp = {...data};
        temp.resources[idx].platform = event.target.value;
        setData(temp);
    }

    const linkChangeHandler = (event,idx) => {
        let temp = {...data};
        temp.resources[idx].link = event.target.value;
        setData(temp);
    }

    return (<div className={classes.container}>
        <input className={classes.name} name="name" value={data.name} onChange ={(event) => nameChangeHandler(event)}/>
        {data.resources.map((friend,idx) => {
            return (
                <div key={`${friend._id}changes${idx}`}>
                    <input className={classes.platlink} onChange = {(event) => platformChangeHandler(event,idx)} key={`${friend._id}${idx}`} name={idx} value={friend.platform}/>
                    :
                    <input className={classes.platlink} onChange = {(event) => linkChangeHandler(event,idx)} key={`${friend._id}${idx}link`} name={idx} value={friend.link}/>
                </div>
            );
        })}
        <div>
            <button className={`${classes.btn} ${classes.apply}`} onClick = {()=> submitHandler(data,index)}>Apply Changes</button>
            <button className={`${classes.btn} ${classes.cancel}`} onClick = {()=> cancelHandler()}>Cancel</button>
        </div>
        
    </div>);
}

export default EditCard;