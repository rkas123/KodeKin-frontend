import axios from 'axios';

const API = axios.create({
    // baseURL: "http://localhost:5000",
    baseURL: "https://kodekin.herokuapp.com/",
});

API.interceptors.request.use((req) =>{
    if(localStorage.getItem('profile'))
    {
        req.headers.authorization =
            `Bearer ${
                JSON.parse(localStorage.getItem('profile')).token
            }`;
    }
    return req;
});

export const signin = (userData) => API.post("/user/signin",userData);
export const signup = (userData) => API.post("/user/signup",userData);
export const forgotpassword = (userData) => API.post("/user/changepassword",userData);

export const addresource = (data) => API.patch("change/addresource",data);
export const addfriend = (data) => API.patch("/change/addfriend",data);
export const getfriends = () => API.get("/change/getfriends");
export const deletefriend = (data) => API.patch("/change/deletefriend",data);
export const editFriend = (data) => API.patch("/change/editfriend",data);