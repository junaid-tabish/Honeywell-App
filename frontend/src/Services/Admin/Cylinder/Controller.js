import axios from "axios";

axios.defaults.headers.common['Authorization']=`Bearer ${localStorage.getItem('token')}`

const getCylinders= (data)=>{
    const {search, sort, page, limit, order} = data
    return axios.get(`${process.env.REACT_APP_API_URL}admin/cylinders?search=${search}&sort=${sort}&page=${page}&limit=${limit}&order=${order}`)
}   

const addCylinder = (data) => {
    return axios.post(`${process.env.REACT_APP_API_URL}admin/cylinder`, data)
}
const getCylinder = id => {
    return axios.get(`${process.env.REACT_APP_API_URL}admin/cylinder/${id}`)
}

const generateCylinderId = () => {
    return axios.get(`${process.env.REACT_APP_API_URL}admin/cylindersCount`)
}

const getBatchDetails = () => {

    return axios.get(`${process.env.REACT_APP_API_URL}admin/batches`)
}

const updateBatchDetails = (id,data) => {
    return axios.put(`${process.env.REACT_APP_API_URL}admin/cylinder/${id}`, data)
}

const deleteCylinderDetails = id => {
    return axios.delete(`${process.env.REACT_APP_API_URL}admin/cylinder/${id}`)
}

 const replacementRequest=(data)=>{
    return axios.put(`${process.env.REACT_APP_API_URL}contractor/cylinder/replacement-request`,data)
  }
  const replacementRequestResponse=(data)=>{
    return axios.put(`${process.env.REACT_APP_API_URL}contractor/cylinder/replacement-request-response`,data)
  }

export {getCylinders, addCylinder, getCylinder, 
        generateCylinderId, getBatchDetails, updateBatchDetails, deleteCylinderDetails,replacementRequest,replacementRequestResponse}