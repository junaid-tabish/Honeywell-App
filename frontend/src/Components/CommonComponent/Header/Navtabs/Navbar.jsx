import React, { useState } from "react";
import { AppBar, Box, Hidden, IconButton, Toolbar, Typography } from "@material-ui/core";
import Notification from "./Notification";
import { useStyles } from "../HeaderStyles";
import MenuIcon from "@material-ui/icons/Menu";
import { USER_ADMIN, USER_DISTRIBUTOR, USER_CONTRACTOR } from "../../../../Utils/Constants";
import Account from "./Account";

export default function Navbar({ handleDrawerOpen }) {
  const classes = useStyles();
  const [role, setRole] = useState(localStorage.getItem("role"));

  if (role === 0) {
    setRole(USER_ADMIN);
  } else if (role === 1) {
    setRole(USER_DISTRIBUTOR);
  } else if (role === 2) {
    setRole(USER_CONTRACTOR);
  }

  return (
    <AppBar position="fixed">
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" className={classes.logo}>
          {"Honeywell"}
        </Typography>
        <Typography variant="h6" className={classes.logo}>
          {role}
        </Typography>
        <Hidden smDown>
          <Box style={{ display: "flex" }}>
            <Notification />

            <Account />
          </Box>
        </Hidden>
        <Hidden mdUp>
          <IconButton color="inherit" onClick={handleDrawerOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}
