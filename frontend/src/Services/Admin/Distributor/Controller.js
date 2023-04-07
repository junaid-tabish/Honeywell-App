import axios from "axios";

axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;

//get all distributors
function getDistributorByRole() {
  return axios.get(`${process.env.REACT_APP_API_URL}admin/distributors`);
}

// addDistributor
function addDistributor(data) {
  return axios.post(`${process.env.REACT_APP_API_URL}admin/distributor`, data);
}

//get data by Id
function getDistributorById(id) {
  return axios.get(`${process.env.REACT_APP_API_URL}admin/distributor/${id}`);
}

//update distributor
function updateDistributor(id, data) {
  return axios.put(`${process.env.REACT_APP_API_URL}admin/distributor/${id}`, data);
}

// delete data
function deleteDistributor(id) {
  return axios.delete(`${process.env.REACT_APP_API_URL}admin/distributor/${id}`);
}

//get active distributors
function getActiveDistributors() {
  return axios.get(`${process.env.REACT_APP_API_URL}admin/distributors/list`);
}
// my code start

// update Distributor's site
function updateDistributorsSite(id, data) {
  return axios.put(`${process.env.REACT_APP_API_URL}admin/distributor/addsite/${id}`, data);
}

//get the list of the sites that can be allocated
function sitesToBeAlloted(id) {
  return axios.get(`${process.env.REACT_APP_API_URL}admin/distributors/sites/${id}`);
}
// get the list of the sites that are already allocated to distributor
function getAllotedSitesOfDistributors(id) {
  return axios.get(`${process.env.REACT_APP_API_URL}admin/distributors/allotedsites/${id}`);
}
// delete and remove the allocated site to distributor
function updateAllotedSite(id, data) {
  return axios.put(`${process.env.REACT_APP_API_URL}admin/distributors/allotedsites/sites/${id}`, data);
}
//my code
// new code start here

function updateDistributorsBatch(id, data) {
  return axios.put(`${process.env.REACT_APP_API_URL}admin/distributor/batch/${id}`, data);
}
//get the list of the sites that can be allocated
function batchesToBeAlloted(id) {
  return axios.get(`${process.env.REACT_APP_API_URL}admin/distributors/batches/${id}`);
}
// get the list of the sites that are already allocated to distributor
function getAllotedBatchesOfDistributors(id) {
  return axios.get(`${process.env.REACT_APP_API_URL}admin/distributors/allotedbatches/${id}`);
}
// delete and remove the allocated site to distributor
function updateAllotedBatch(id, data) {
  return axios.put(`${process.env.REACT_APP_API_URL}admin/distributors/allotedbatches/batches/${id}`, data);
}
function getCount() {
  return axios.get(`${process.env.REACT_APP_API_URL}admin/count`);
}
function getDistributor(data) {
  return axios.get(`${process.env.REACT_APP_API_URL}admin/distributors${data}`);
}

// new code ends here

export {
  getDistributorByRole,
  getCount,
  getDistributor,
  addDistributor,
  getDistributorById,
  updateDistributor,
  deleteDistributor,
  getActiveDistributors,
  updateDistributorsSite,
  sitesToBeAlloted,
  getAllotedSitesOfDistributors,
  updateAllotedSite,
  updateDistributorsBatch,
  batchesToBeAlloted,
  getAllotedBatchesOfDistributors,
  updateAllotedBatch,
};
