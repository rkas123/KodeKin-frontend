import classes from './Message.module.css';

const Message = (props) => {
    return <div className={classes.container}>{props.children}</div>
}

export default Message;