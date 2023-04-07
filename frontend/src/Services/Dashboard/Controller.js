import axios from "axios";
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
  "token"
)}`;

const getCount = () => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}${localStorage
      .getItem("role")
      .toLowerCase()}/count`
  );
};

const getInventoryCount = () => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}${localStorage
      .getItem("role")
      .toLowerCase()}/inventory`
  );
};

export { getCount, getInventoryCount };
