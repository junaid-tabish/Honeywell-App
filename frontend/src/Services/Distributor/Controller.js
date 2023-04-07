import axios from "axios";
// axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;

export const getCylindersDistributor = (data) => {
  const {search, sort, page, limit, order} = data
  return axios.get(`${process.env.REACT_APP_API_URL}distributor/cylinders?search=${search}&sort=${sort}&page=${page}&limit=${limit}&order=${order}`,
  {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`
    },
  })
} 