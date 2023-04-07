import axios from "axios";

axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;


const getAllotedBatchesOfDistributors=(id,data)=> {

	return axios.get(`${process.env.REACT_APP_API_URL}distributor/allotedbatches/${id}${data}`);
  
  }

  
  export {getAllotedBatchesOfDistributors}