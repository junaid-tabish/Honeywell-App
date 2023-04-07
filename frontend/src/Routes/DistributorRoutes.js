import AssetTracking from '../Components/BodyComponent/AssetTracking/AssetTracking'
import ContractorList from '../Components/BodyComponent/ContractorDetails/ContractorList'
import UpdateContractor from '../Components/BodyComponent/ContractorDetails/UpdateContractor'
import Batches from '../Components/BodyComponent/Batches/Batches'
import AddBatches from '../Components/BodyComponent/Batches/AddBatches'
import UpdateBatches from '../Components/BodyComponent/Batches/UpdateBatches'
import Cylinder from '../Components/BodyComponent/Cylinder/Cylinder'
import Scan from '../Components/BodyComponent/Scan/Scan'
import DailyScan from '../Components/BodyComponent/DailyScan/DailyScan'
import Dashboard from '../Components/BodyComponent/Dashboard/Dashboard'
import AddContractor from '../Components/BodyComponent/ContractorDetails/AddContractor'
import { useStyles } from '../Components/CommonComponent/Header/HeaderStyles'
import { useState } from 'react'
import Navbar from '../Components/CommonComponent/Header/Navtabs/Navbar'
import Sidenav from '../Components/CommonComponent/Sidebar/Sidenav'
import { Box } from '@material-ui/core'
import {  Route, Switch } from 'react-router-dom';
import NotFound from '../Components/CommonComponent/NotFound/NotFound'
import FooterComponent from '../Components/CommonComponent/Footer/FooterComponent'
import Profile from '../Components/CommonComponent/Header/Navtabs/Profile/Profile'
import Site from '../Components/BodyComponent/Site/Site'
import AddSite from '../Components/BodyComponent/Site/AddSite'
import UpdateSite from '../Components/BodyComponent/Site/UpdateSite'
import AddCylinder from "../Components/BodyComponent/Cylinder/AddCylinder";
import UpdateCylinder from "../Components/BodyComponent/Cylinder/UpdateCylinder";
import ViewContractor from '../Components/BodyComponent/ContractorDetails/viewContractor'
import ManageSites from '../Components/BodyComponent/ContractorDetails/ManageSites'
import AllotSites from '../Components/BodyComponent/ContractorDetails/AllotSites'
import AssignCylinder from '../Components/BodyComponent/ContractorDetails/AssignCylinder'


const DistributorArray=[ 
  {
    path: "/distributor/profile",
    exact: true,
    name: "Profile",
    component: Profile,
  },
  {
    path: "/distributor/dashboard",
    exact: true,
    name: "Dashboard",
    component: Dashboard,
  },
  

  //contractors
  {
    path: "/distributor/contractor",
    exact: true,
    name: "Distributor-Contractor",
    component: ContractorList,
  },
  {
    path: "/distributor/contractor/add",
    exact: true,
    name: "Distributor-Contractor",
    component: AddContractor,
  },
  {
    path: "/distributor/contractor/edit/:id",
    exact: true,
    name: "Distributor-Contractor",
    component: UpdateContractor,
  },
  {
    path: "/distributor/contractor/view/:id",
    exact: true,
    name: "Distributor-Contractor",
    component: ViewContractor,
  },
  {
    path: "/distributor/contractor/managesites/:id",
    exact: true,
    name: "Distributor-Contractor",
    component: ManageSites,
  },
  {
    path: "/distributor/contractor/allotsites/:id",
    exact: true,
    name: "Distributor-Contractor",
    component: AllotSites,
  },
  {
    path: "/distributor/contractor/managecylinder/:id",
    exact: true,
    name: "Admin-Contractor",
    component: AssignCylinder,
  },

  //batches
  {
    path: "/distributor/batch",
    exact: true,
    name: "Dashboard",
    component: Batches,
  },
  {
    path: "/distributor/batch/add",
    exact: true,
    name: "Dashboard",
    component: AddBatches,
  },
  {
    path: "/distributor/batch/edit/:id",
    exact: true,
    name: "Dashboard",
    component: UpdateBatches,
  },
  //site

  {
    path: "/distributor/site",
    exact: true,
    name: "Distributor-Site",
    component: Site,
  },
  {
    path: "/distributor/site/add",
    exact: true,
    name: "Distributor-Site",
    component: AddSite,
  },
  {
    path: "/distributor/site/edit/:id",
    exact: true,
    name: "Distributor-Site",
    component: UpdateSite,
  },

  //cylinder
  {
    path: "/distributor/cylinder",
    exact: true,
    name: "Distributor-Cylinder",
    component: Cylinder,
  },
  {
    path: "/distributor/cylinder/add",
    exact: true,
    name: "Distributor-Cylinder",
    component: AddCylinder,
  },
  {
    path: "/distributor/cylinder/edit/:id",
    exact: true,
    name: "Distributor-Cylinder",
    component: UpdateCylinder,
  },

  //scan
  {
    path: "/distributor/scan",
    exact: true,
    name: "Dashboard",
    component: Scan,
  },
  {
    path: "/distributor/dailyScan",
    exact: true,
    name: "Dashboard",
    component: DailyScan,
  },
  //assettracking
  {
    path: "/distributor/assettracking",
    exact: true,
    name: "Dashboard",
    component: AssetTracking,
  },
]

function DistributorRoutes() {
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
        <Navbar handleDrawerOpen={handleDrawerOpen} />
          <Sidenav
            mobileOpen={mobileOpen}
            handleDrawerOpen={handleDrawerOpen}
            handleDrawerClose={handleDrawerClose}
          />
          <Box className={classes.wrapper}>
  
        <Switch>
              {DistributorArray.map((route, idx) => {
                return (
                  !!route.component && (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      component={route.component}
                    />
                  )
                );
              })}
             <Route component={NotFound} />
            </Switch>
            </Box>
  
            <FooterComponent />
      </div>
    )
  }
  

export default DistributorRoutes