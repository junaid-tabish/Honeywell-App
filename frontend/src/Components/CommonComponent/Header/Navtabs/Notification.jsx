import React, { useState, useEffect } from "react";
import moment from 'moment'
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  Typography
} from "@material-ui/core";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import { useStyles } from "../HeaderStyles";
import { getNotifications } from "../../../../Services/Admin/Notifications/controller";
import { markNotificationsAsRead } from "../../../../Services/Admin/Notifications/controller";


export default function Notification() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsData, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = async() => {
    const res = await markNotificationsAsRead()
    if(res.data.status === 1){
      fetchData()
    }
    setAnchorEl(null);
  };

  const fetchData = async () => {
    const response = await getNotifications()
    if(response.data.status === 1){
      setNotifications(response.data.data.data)
      setUnread(response.data.data.unreadCount)
    }
  }
  useEffect(()=>{
    fetchData()
  },[])
   

  return (
    <Box>
      <IconButton
        aria-controls="Notification"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
      >
        <Badge badgeContent={unread} color="secondary">
          <NotificationsActiveIcon/>
        </Badge>
      </IconButton>
      <Menu
        id="Notification"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <List className={classes.navlist}>
          {notificationsData.length !== 0 ? (notificationsData.map((item, i) => {
            const isRead = item.status === 0
            return (<ListItem key={i} onClick={handleClose} style={isRead? {background: 'white'}: {background: '#f2f1eb', borderBottom: 'solid', borderBottomColor: 'white'}}>
              <ListItemIcon>
                <Avatar className={classes.ulAvater}>
                  {item.message[0].toUpperCase()}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={item.message}
              secondary={<Typography variant="subtitle2" style={{color: 'grey'}}>{moment(new Date(item.createdAt)).fromNow()}</Typography>}
              ></ListItemText>
            </ListItem>)
            })): <ListItem>Empty</ListItem>}
        </List>
      </Menu>
    </Box>
  );
}
