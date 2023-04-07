import React from "react";
import { List, ListItem, ListItemText, Button } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { useStyles } from "../Header/HeaderStyles";
import { useEffect } from "react";
import { useState } from "react";
import { USER_ADMIN, USER_CONTRACTOR, USER_DISTRIBUTOR } from "../../../Utils/Constants";
import { useLocation } from "react-router-dom";

export default function SidenavData({ handleDrawerClose }) {
  const location = useLocation()
  const classes = useStyles();
  const [listItem, setListItem] = useState([]);

  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    role === USER_ADMIN
      ? setListItem([
          { label: "Dashboard", link: "/admin/dashboard" },
          { label: "Distributor", link: "/admin/distributor" },
          { label: "Contractor", link: "/admin/contractor" },
          { label: "Batches", link: "/admin/batch" },
          { label: "Cylinder", link: "/admin/cylinder" },
          { label: "Sites", link: "/admin/site" },
          { label: "Scan", link: "/admin/scan" },
          { label: "Daily Scan", link: "/admin/dailyscan" },
          { label: "Asset Tracking", link: "/admin/assettracking" },
        ])
      : role === USER_DISTRIBUTOR
      ? setListItem([
        { label: "Dashboard", link: "/distributor/dashboard" },
        { label: "Contractor", link: "/distributor/contractor" },
        { label: "Batches", link: "/distributor/batch" },
        { label: "Cylinder", link: "/distributor/cylinder" },
        { label: "Sites", link: "/distributor/site" },
        { label: "Scan", link: "/distributor/scan" },
        { label: "Daily Scan", link: "/distributor/dailyscan" },
        { label: "Asset Tracking", link: "/distributor/assettracking" },
        ])
      : role === USER_CONTRACTOR
      ? setListItem([
        { label: "Dashboard", link: "/contractor/dashboard" },
        { label: "Batches", link: "/contractor/batch" },
        { label: "Cylinder", link: "/contractor/cylinder" },
        { label: "Sites", link: "/contractor/site" },
        { label: "Scan", link: "/contractor/scan" },
        { label: "Daily Scan", link: "/contractor/dailyscan" },
        { label: "Asset Tracking", link: "/contractor/assettracking" },
        ])
      : setListItem([]);
  }, [role]);

  return (
    <List>
      {/* {console.log(role)} */}
      {listItem?.map((item, i) => {
        const isActive = location.pathname.includes(item.link)
        return(
        <Button size="small" className={classes.navButton} onClick={() => handleDrawerClose()} key={i}>
          <ListItem exact component={NavLink} to={item.link}  className={isActive? '': classes.navlinks} >
            <ListItemText>{item.label}</ListItemText>
          </ListItem>
        </Button>
      )})}
    </List>
  );
}
