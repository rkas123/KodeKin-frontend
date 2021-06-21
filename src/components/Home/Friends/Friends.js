import {useEffect, useState,useContext,useRef} from 'react';
import ReactPaginate from 'react-paginate';
import Card from './Card/Card';
import AddFriend from './AddFriend/AddFriend';
import Message from '../../../utils/Message/Message';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row,Col} from 'react-bootstrap';
import classes from './Friends.module.css';
import Loader from '../../../utils/Loader/Loader';
import context from '../../../contexts/context';
import * as api from '../../../api/index';
import { Modal,Button } from 'react-bootstrap';

const Friends = () => {
    const ctx = useContext(context);
    const [list,setList] = useState([]);
    const [reload,setReload] = useState(false);
    const [addUser,setAddUser] = useState(false);
    const [searchBar,setSearchBar] = useState("");
    const [filteredList,setFilteredList] = useState([]);
    const [showMessage,setShowMessage] = useState(false);
    const [showModal,setShowModal] = useState(false);
    const [loader,setLoader] = useState(true);
    const [pageNumber,setPageNumber] = useState(0);

    const idx = useRef(null);

    const errorAuthHandler = (error) => {
        if(error.response.data.type === "1")
            {
                localStorage.clear();
                setShowMessage(true);
            }
    }

    const addFriendHandler = async(name) =>{
        setLoader(true);
        try{
            const data = await api.addfriend({name: name})
            for(let i=0;i<data.data.friends.length;i++)
                data.data.friends[i].index=i;
            setList(data.data.friends);
        }
        catch(error)
        {
            console.log(error);
        }
        setLoader(false);
        setAddUser(false);
    }

    const forceReload = () =>{
        setReload((prevState)=> !prevState);
    }

    const deleteFriendHandler = async (index) =>{
        setShowModal(false);
        setLoader(true);
        try{
            const data = await api.deletefriend({index:index});
            for(let i=0;i<data.data.data.length;i++)
            {
                data.data.data[i].index = i;
            }
            idx.current = null;
            setList(data.data.data);
        }
        catch(error){
            errorAuthHandler(error);
        }
        setLoader(false);
        idx.current = null;
    }


    const delHandler = async (index) => {
        idx.current = index;
        setShowModal(true);

    }

    const editFriend = async(friendData,index) => {
        try{
            const data = await api.editFriend({
                data:friendData,
                index:index
            });
            
            for(let i=0;i<data.data.data.length;i++)
            {
                data.data.data[i].index = i;
            }

            setList(data.data.data);
            return new Promise((resolve,reject) => resolve(true));
        }
        catch(error){
            errorAuthHandler(error);
        }
    }

    const cancelHandler = () => {
        setAddUser(false);
    }

    const filterChangeHandler = (event) =>{
        setSearchBar(event.target.value);
    }

    useEffect(()=>{
        const dat = searchBar.toLowerCase();
        if(searchBar !== "")
        {
            const data = list.filter((friend) => friend.name.toLowerCase().includes(dat));
            setFilteredList(data);
        }
        else
        {
            setFilteredList(list);
        }
        
    },[searchBar,list]);
    
    useEffect(()=>{
        async function fetchList(){
            let data;
            try{
                data = await api.getfriends();
                for(let i=0;i<data.data.data.length;i++)
                    data.data.data[i].index=i;
                setList(data.data.data);
                setFilteredList(data.data.data);
                setLoader(false);
            }
            catch(error)
            {
                setLoader(false);
                errorAuthHandler(error);
            }
        }
        fetchList();
    },[reload]);




    // Pagination Stuff
    
    const perPage = 9;
    const alreadyDisplayed = pageNumber*perPage;

    const displayFriends = filteredList.slice(alreadyDisplayed,alreadyDisplayed+perPage);

    const changePage = ({selected}) =>{
        setPageNumber(selected);
    }
    //
    if(loader)
    {
        return <Loader/>
    }

    if(showMessage)
    {
        return (<Message>
            <h1>JWT token expired or Authorization failed. You need to <a href="/login">Login</a> again!</h1>
        </Message>);
    }

    let mod = null;
    if(showModal)
    {
        mod = (
            <>
                <Modal show={showModal} onHide={()=> {idx.current = null; setShowModal(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Warning!</Modal.Title>
                </Modal.Header>
                <Modal.Body>{`Are You Sure you want to delete ${list[idx.current].name} from friend's?`}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={()=> deleteFriendHandler(idx.current)}>
                        Delete Friend
                    </Button>
                    <Button variant="secondary" onClick={()=>{idx.current=null; setShowModal(false)}}>
                        Cancel
                    </Button>
                </Modal.Footer>
                </Modal>
            </>
        );
    }

    return(
        <>
        {mod}
        <div className={classes.friendContainer}>
            { !addUser ? 
                <button className ={classes.btn} onClick = {()=>{setAddUser(true)}}>Add New Friend</button>
                :
                <AddFriend addFriendHandler={addFriendHandler} cancelHandler = {()=>cancelHandler()}/>
            }
            {!addUser && <input onChange = {(event)=>filterChangeHandler(event)}className={classes.Search} placeholder="Search Friend"></input>}
        </div>
        <div>
        <Row>
            {displayFriends.map((friend,idx) => <Col lg={4} sm={6} key={friend._id}>
                    <Card editFriend = {editFriend} deleteFriendHandler = {()=>delHandler(friend.index)} forceReload = {forceReload} index ={friend.index} friend={friend} key={`${friend.name}idx`}/>
                </Col>)}
        </Row>
        <ReactPaginate
            previousLabel={"Prev"}
            nextLabel={"Next"}
            pageCount={Math.ceil(filteredList.length / perPage)} 
            onPageChange={changePage}
            containerClassName={classes.paginationbtns}
            activeClassName={classes.paginationbtnActive}
        />
        </div>
        </>
    )
}

export default Friends;