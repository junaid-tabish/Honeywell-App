import axios from "axios";
axios.defaults.headers.common['Authorization']=`Bearer ${localStorage.getItem('token')}`

function addContractorDetails(data){
    return axios.post(`${process.env.REACT_APP_API_URL}${localStorage.getItem("role").toLowerCase()}/contractor`,data)
}

function deleteContractor(id){
    return axios.delete(`${process.env.REACT_APP_API_URL}${localStorage.getItem("role").toLowerCase()}/contractor/${id}`)
}

function updateContractor(id, data){
    return axios.put(`${process.env.REACT_APP_API_URL}${localStorage.getItem("role").toLowerCase()}/contractor/${id}`, data);
}
function updateSites(id,data){
    
    return axios.put(`${process.env.REACT_APP_API_URL}${localStorage.getItem("role").toLowerCase()}/contractor/updatesites/${id}`,data)
}
function siteToBeAlloted(id){
    return axios.get(`${process.env.REACT_APP_API_URL}${localStorage.getItem("role").toLowerCase()}/contractor/sites/${id}`)
}
function getContractor(id){
    return axios.get(`${process.env.REACT_APP_API_URL}${localStorage.getItem("role").toLowerCase()}/contractor/${id}`)
}
function siteAlloted(id){
    return axios.get(`${process.env.REACT_APP_API_URL}${localStorage.getItem("role").toLowerCase()}/contractor/allotedsites/${id}`)
}
function deleteSite(id,data){
    return axios.put(`${process.env.REACT_APP_API_URL}${localStorage.getItem("role").toLowerCase()}/contractor/allotedsites/${id}`,data)
}
function getDistributorDetails(id){
    return axios.get(`${process.env.REACT_APP_API_URL}admin/contractor/assigncylinder/${id}`)
}
function contractorsDetails(data){
    const {search, sort, page, limit, order} = data
    return axios.get(`${process.env.REACT_APP_API_URL}${localStorage.getItem("role").toLowerCase()}/contractors?search=${search}&sort=${sort}&page=${page}&limit=${limit}&order=${order}`)
}
function getBatches(id){
    return axios.get(`${process.env.REACT_APP_API_URL}${localStorage.getItem("role").toLowerCase()}/contractor/assigncylinder-batches/${id}`)
}
function getCylinderFromBatch(id){
    return axios.get(`${process.env.REACT_APP_API_URL}${localStorage.getItem("role").toLowerCase()}/contractor/assigncylinder-cylinders/${id}`)
}
function assignCylinder(id,data){
    return axios.put(`${process.env.REACT_APP_API_URL}${localStorage.getItem("role").toLowerCase()}/contractor/assigncylinder/${id}`,data)
}
export{addContractorDetails,deleteContractor,assignCylinder,getDistributorDetails,getBatches,updateContractor,updateSites,getCylinderFromBatch,siteAlloted,siteToBeAlloted,getContractor,deleteSite,contractorsDetails}
