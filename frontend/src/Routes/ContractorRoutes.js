import AssetTracking from "../Components/BodyComponent/AssetTracking/AssetTracking";
import Batches from "../Components/BodyComponent/Batches/Batches";
import AddBatches from "../Components/BodyComponent/Batches/AddBatches";
import UpdateBatches from "../Components/BodyComponent/Batches/UpdateBatches";
import Cylinder from "../Components/BodyComponent/Cylinder/Cylinder";
import Scan from "../Components/BodyComponent/Scan/Scan";
import DailyScan from "../Components/BodyComponent/DailyScan/DailyScan";
import Dashboard from "../Components/BodyComponent/Dashboard/Dashboard";
import { useStyles } from "../Components/CommonComponent/Header/HeaderStyles";
import { useState } from "react";
import Navbar from "../Components/CommonComponent/Header/Navtabs/Navbar";
import Sidenav from "../Components/CommonComponent/Sidebar/Sidenav";
import { Box } from "@material-ui/core";
import { Route, Switch } from "react-router-dom";
import NotFound from "../Components/CommonComponent/NotFound/NotFound";
import FooterComponent from "../Components/CommonComponent/Footer/FooterComponent";
import Profile from "../Components/CommonComponent/Header/Navtabs/Profile/Profile";
import Site from "../Components/BodyComponent/Site/Site";
import AddSite from "../Components/BodyComponent/Site/AddSite";
import UpdateSite from "../Components/BodyComponent/Site/UpdateSite";
import AddCylinder from "../Components/BodyComponent/Cylinder/AddCylinder";
import UpdateCylinder from "../Components/BodyComponent/Cylinder/UpdateCylinder";

const ContractorArray = [
  {
    path: "/contractor/profile",
    exact: true,
    name: "Profile",
    component: Profile,
  },
  {
    path: "/contractor/dashboard",
    exact: true,
    name: "Dashboard",
    component: Dashboard,
  },
  
  //batches
  {
    path: "/contractor/batch",
    exact: true,
    name: "Dashboard",
    component: Batches,
  },
  {
    path: "/contractor/batch/add",
    exact: true,
    name: "Dashboard",
    component: AddBatches,
  },
  {
    path: "/contractor/batch/edit/:id",
    exact: true,
    name: "Dashboard",
    component: UpdateBatches,
  },
  //site

  {
    path: "/contractor/site",
    exact: true,
    name: "Distributor-Site",
    component: Site,
  },
  {
    path: "/contractor/site/add",
    exact: true,
    name: "Distributor-Site",
    component: AddSite,
  },
  {
    path: "/contractor/site/edit/:id",
    exact: true,
    name: "Distributor-Site",
    component: UpdateSite,
  },

  //cylinder
  {
    path: "/contractor/cylinder",
    exact: true,
    name: "Distributor-Cylinder",
    component: Cylinder,
  },
  {
    path: "/contractor/cylinder/add",
    exact: true,
    name: "Distributor-Cylinder",
    component: AddCylinder,
  },
  {
    path: "/contractor/cylinder/edit/:id",
    exact: true,
    name: "Distributor-Cylinder",
    component: UpdateCylinder,
  },

  //scan
  {
    path: "/contractor/scan",
    exact: true,
    name: "Dashboard",
    component: Scan,
  },
  {
    path: "/contractor/dailyScan",
    exact: true,
    name: "Dashboard",
    component: DailyScan,
  },
  //assettracking
  {
    path: "/contractor/assettracking",
    exact: true,
    name: "Dashboard",
    component: AssetTracking,
  },
];

function ContractorRoutes() {
  const classes = useStyles();

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerOpen = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleDrawerClose = () => {
    setMobileOpen(false);
  };
  return (
    <div>
      <Navbar handleDrawerOpen={handleDrawerOpen} /> <Sidenav mobileOpen={mobileOpen} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />{" "}
      <Box className={classes.wrapper}>
        <Switch>
          {" "}
          {ContractorArray.map((route, idx) => {
            return !!route.component && <Route key={idx} path={route.path} exact={route.exact} name={route.name} component={route.component} />;
          })}{" "}
          <Route component={NotFound} />{" "}
        </Switch>{" "}
      </Box>
      <FooterComponent />
    </div>
  );
}

export default ContractorRoutes;
