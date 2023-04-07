import axios from "axios";

axios.defaults.headers.common['Authorization']=`Bearer ${localStorage.getItem('token')}`



const addBatch = (data) => {
  return axios.post(`${process.env.REACT_APP_API_URL}admin/batch`, data);
};

const getbatch = (data) => {
  return axios.get(`${process.env.REACT_APP_API_URL}admin/batches${data}`);
};

const loadBatch = (data) => {
  return axios.get(`${process.env.REACT_APP_API_URL}admin/batch/${data}`);
};

const updateBatch = (data, id) => {
  return axios.put(`${process.env.REACT_APP_API_URL}admin/batch/${id}`, data);
};

const deleteBatch = (data) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}admin/batch/${data}`);
};
const getCount = () => {
  return axios.get(`${process.env.REACT_APP_API_URL}admin/count`);
};
export {
  addBatch,
  getbatch,
  loadBatch,
  updateBatch,
  deleteBatch,
  getCount
};