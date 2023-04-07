import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { Avatar, Box, Button, ListItem, Menu } from "@material-ui/core";
import { useStyles } from "../HeaderStyles";
import {Link} from "react-router-dom";

export default function Account() {
  const history = useHistory();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    history.push("/");
  };

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <Box>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        startIcon={<Avatar className={classes.navAvatar}></Avatar>}
      ></Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{marginTop:"40px"}}
  
      >
        <MenuItem component={ListItem} onClick={handleClose}>
          <MenuList>
            <Link to={`/${localStorage.getItem("role").toLowerCase()}/profile`}  style={{textDecoration:"none"}}><MenuItem style={{color:"black"}}>Profile</MenuItem></Link>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </MenuItem>
      </Menu>
    </Box>
  );
}
