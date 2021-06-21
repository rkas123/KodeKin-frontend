import { useContext } from 'react';
import Friends from './Friends/Friends';
import classes from './Home.module.css';
import context from '../../contexts/context';
import Message from '../../utils/Message/Message';
import Right from '../Home/Right/Right';
import 'bootstrap/dist/css/bootstrap.min.css';

import {Row,Col} from 'react-bootstrap';

const Home = () => {
    const ctx = useContext(context);
    if(!ctx.isLoggedIn)
    {
        return (<Message>
            <h2>You are not Logged In!</h2>
            <p><a href="/login">Login</a> or <a href="/signup">Sign Up</a> to view Content.</p>
        </Message>);
    }

    return (
        <div className={classes.home}>
            
            <Row>
                <Col lg={8}> <Friends /></Col>
                <Col lg={4}>
                    <Right/> 
                </Col>
            </Row>
        </div>
    );
}

export default Home;