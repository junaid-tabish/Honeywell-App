import axios from "axios";

//get notifications
function getNotifications() {
    return axios.get(`${process.env.REACT_APP_API_URL}admin/notifications`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      },
    });
  }
  
function markNotificationsAsRead(){
  return axios.get(`${process.env.REACT_APP_API_URL}admin/mark/notifications`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`
    },
  });
}  
export {getNotifications, markNotificationsAsRead}