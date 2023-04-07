import axios from "axios";
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
  "token"
)}`;

function Addsite(data) {
  return axios.post(`${process.env.REACT_APP_API_URL}admin/site`, data);
}
function Updatesite(id, data) {
  return axios.put(`${process.env.REACT_APP_API_URL}admin/site/${id}`, data);
}
function Deletesite(id) {
  return axios.delete(`${process.env.REACT_APP_API_URL}admin/site/${id}`);
}
function Getsite(data) {
  return axios.get(`${process.env.REACT_APP_API_URL}admin/sites${data}`);
}
const getCount = () => {
  return axios.get(`${process.env.REACT_APP_API_URL}admin/count`);
};
function GetDistributor() {
  return axios.get(`${process.env.REACT_APP_API_URL}admin/distributors/list`);
}
function getcontractorsallocatedtodistributor(id) {
  return axios.get(
    `${process.env.REACT_APP_API_URL}admin/sites/contractor/${id}`
  );
}
export {
  Addsite,
  Updatesite,
  Deletesite,
  Getsite,
  getCount,
  GetDistributor,
  getcontractorsallocatedtodistributor,
};
