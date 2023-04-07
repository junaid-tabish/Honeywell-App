import axios from "axios";

export const getCylindersContractor = (data) => {
  const {search, sort, page, limit, order} = data
  return axios.get(`${process.env.REACT_APP_API_URL}contractor/cylinders?search=${search}&sort=${sort}&page=${page}&limit=${limit}&order=${order}`,
  {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`
    },
  })
} 

///