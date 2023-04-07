import axios from "axios";

const getActiveDistributors = () => {
  return axios.get(`${process.env.REACT_APP_API_URL}admin/asset-Track-Distributors/`);
};


const getActiveCylinders = () => {
  return axios.get(`${process.env.REACT_APP_API_URL}admin/asset-Track-Cylinders/`);
};

const getActiveContractors = (id) => {
  return axios.get(`${process.env.REACT_APP_API_URL}admin/asset-Track-Contractors/${id}`);
};

const getActiveSites = (id) => {
  return axios.get(`${process.env.REACT_APP_API_URL}admin/asset-Track-Sites/${id}`);
};

const getCylinders = (distId, contId, siteId) => {
  return axios.get(`${process.env.REACT_APP_API_URL}admin/searchCylinder?distributorId=${distId}&contractorId=${contId}&siteId=${siteId}`);
};

export { getActiveDistributors, getActiveContractors, getActiveSites, getActiveCylinders, getCylinders };
