import axios from "axios";

const getProfile=(paramters)=>{
    return axios.get(`${process.env.REACT_APP_API_URL}${paramters.path}/profile/${paramters.id}`)
}


export {getProfile}