import AssetTracking from "../Components/BodyComponent/AssetTracking/AssetTracking";
import ContractorList from "../Components/BodyComponent/ContractorDetails/ContractorList";
import UpdateContractor from "../Components/BodyComponent/ContractorDetails/UpdateContractor";
import ViewContractor from "../Components/BodyComponent/ContractorDetails/viewContractor";
import AddDistributor from "../Components/BodyComponent/DistributorDetails/AddDistributor";
import UpdateDistributor from "../Components/BodyComponent/DistributorDetails/UpdateDistributor";
import ViewDistributor from "../Components/BodyComponent/DistributorDetails/ViewDistributor";
import DistributorList from "../Components/BodyComponent/DistributorDetails/DistributorList";
import Batches from "../Components/BodyComponent/Batches/Batches";
import AddBatches from "../Components/BodyComponent/Batches/AddBatches";
import UpdateBatches from "../Components/BodyComponent/Batches/UpdateBatches";
import Cylinder from "../Components/BodyComponent/Cylinder/Cylinder";
import AddCylinder from "../Components/BodyComponent/Cylinder/AddCylinder";
import UpdateCylinder from "../Components/BodyComponent/Cylinder/UpdateCylinder";
import Scan from "../Components/BodyComponent/Scan/Scan";
import DailyScan from "../Components/BodyComponent/DailyScan/DailyScan";
import Dashboard from "../Components/BodyComponent/Dashboard/Dashboard";
import AddContractor from "../Components/BodyComponent/ContractorDetails/AddContractor";
import { Route, Switch } from "react-router-dom";
import Navbar from "../Components/CommonComponent/Header/Navtabs/Navbar";
import Sidenav from "../Components/CommonComponent/Sidebar/Sidenav";
import { Box } from "@material-ui/core";
import FooterComponent from "../Components/CommonComponent/Footer/FooterComponent";
import { useStyles } from "../Components/CommonComponent/Header/HeaderStyles";
import { useState } from "react";
import NotFound from "../Components/CommonComponent/NotFound/NotFound";
import Site from "../Components/BodyComponent/Site/Site";
import AddSite from "../Components/BodyComponent/Site/AddSite";
import UpdateSite from "../Components/BodyComponent/Site/UpdateSite";
import ManageSites from "../Components/BodyComponent/ContractorDetails/ManageSites";
import AllotSites from "../Components/BodyComponent/ContractorDetails/AllotSites";
import Profile from "../Components/CommonComponent/Header/Navtabs/Profile/Profile";
import AssignCylinder from "../Components/BodyComponent/ContractorDetails/AssignCylinder"
import SiteDistributor from "../Components/BodyComponent/DistributorDetails/SiteDistributor";
import BatchDistributor from "../Components/BodyComponent/DistributorDetails/BatchDistributor";
import ManageBatches from "../Components/BodyComponent/DistributorDetails/ManageBatches";
import ManageSitesDistributor from "../Components/BodyComponent/DistributorDetails/ManageSites";

const AdminRoutesArray = [
  {
    path: "/admin/profile",
    exact: true,
    name: "Profile",
    component: Profile,
  },
  {
    path: "/admin/dashboard",
    exact: true,
    name: "Dashboard",
    component: Dashboard,
  },
  //distributors
  {
    path: "/admin/distributor",
    exact: true,
    name: "Admin-Distributor",
    component: DistributorList,
  },
  {
    path: "/admin/distributor/add",
    exact: true,
    name: "Admin-Distributor",
    component: AddDistributor,
  },
  {
    path: "/admin/distributor/edit/:id",
    exact: true,
    name: "Admin-Distributor",
    component: UpdateDistributor,
  },
  {
    path: "/admin/distributor/view/:id",
    exact: true,
    name: "Admin-Distributor",
    component: ViewDistributor,
  },
  {
    path: "/admin/distributor/managesite/:id",
    exact: true,
    name: "Admin-Distributor",
    component: ManageSitesDistributor,
  },
  {
    path: "/admin/distributor/site/:id",
    exact: true,
    name: "Admin-Distributor",
    component: SiteDistributor,
  },
  {
    path: "/admin/distributor/managebatch/:id",
    exact: true,
    name: "Admin-Distributor",
    component: ManageBatches,
  },
  {
    path: "/admin/distributor/batch/:id",
    exact: true,
    name: "Admin-Distributor",
    component: BatchDistributor,
  },

  //contractors
  {
    path: "/admin/contractor",
    exact: true,
    name: "Admin-Contractor",
    component: ContractorList,
  },
  {
    path: "/admin/contractor/add",
    exact: true,
    name: "Admin-Contractor",
    component: AddContractor,
  },
  {
    path: "/admin/contractor/edit/:id",
    exact: true,
    name: "Admin-Contractor",
    component: UpdateContractor,
  },
  {
    path: "/admin/contractor/view/:id",
    exact: true,
    name: "Admin-Contractor",
    component: ViewContractor,
  },
  {
    path: "/admin/contractor/managesites/:id",
    exact: true,
    name: "Admin-Contractor",
    component: ManageSites,
  },
  {
    path: "/admin/contractor/allotsites/:id",
    exact: true,
    name: "Admin-Contractor",
    component: AllotSites,
  },
  {
    path: "/admin/contractor/managecylinder/:id",
    exact: true,
    name: "Admin-Contractor",
    component: AssignCylinder
  },
  //batches
  {
    path: "/admin/batch",
    exact: true,
    name: "Dashboard",
    component: Batches,
  },
  {
    path: "/admin/batch/add",
    exact: true,
    name: "Dashboard",
    component: AddBatches,
  },
  {
    path: "/admin/batch/edit/:id",
    exact: true,
    name: "Dashboard",
    component: UpdateBatches,
  },
  //site

  {
    path: "/admin/site",
    exact: true,
    name: "Admin-Site",
    component: Site,
  },
  {
    path: "/admin/site/add",
    exact: true,
    name: "Admin-Site",
    component: AddSite,
  },
  {
    path: "/admin/site/edit/:id",
    exact: true,
    name: "Admin-Site",
    component: UpdateSite,
  },

  //cylinder
  {
    path: "/admin/cylinder",
    exact: true,
    name: "Admin-Cylinder",
    component: Cylinder,
  },
  {
    path: "/admin/cylinder/add",
    exact: true,
    name: "Admin-Cylinder",
    component: AddCylinder,
  },
  {
    path: "/admin/cylinder/edit/:id",
    exact: true,
    name: "Admin-Cylinder",
    component: UpdateCylinder,
  },

  //scan
  {
    path: "/admin/scan",
    exact: true,
    name: "Dashboard",
    component: Scan,
  },
  {
    path: "/admin/dailyScan",
    exact: true,
    name: "Dashboard",
    component: DailyScan,
  },
  //assettracking
  {
    path: "/admin/assettracking",
    exact: true,
    name: "Dashboard",
    component: AssetTracking,
  },
];

function AdminRoutes() {
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
          {AdminRoutesArray.map((route, idx) => {
            return (
              !!route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  // name={route.name}
                  component={route.component}
                />
              )
            );
          })}{" "}
          <Route component={NotFound} />
        </Switch>
      </Box>
      <FooterComponent />
    </div>
  );
}

export default AdminRoutes;
