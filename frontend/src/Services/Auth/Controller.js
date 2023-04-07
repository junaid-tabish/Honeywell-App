import axios from "axios";

const loginUser=(data)=>{
    return axios.post(`${process.env.REACT_APP_API_URL}auth/login`,data)
}

const registerUser=(data)=>{ 
    console.log("here in registerUser", data)
    return axios.post(`${process.env.REACT_APP_API_URL}auth/register`,data)
}
export {loginUser,registerUser}