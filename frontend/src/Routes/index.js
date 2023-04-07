import React, { useEffect } from "react";
import LoginRoutes from "./LoginRoutes";
import { Switch } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";

import { USER_CONTRACTOR, USER_DISTRIBUTOR } from "../Utils/Constants";

import ContractorRoutes from "./ContractorRoutes";
import DistributorRoutes from "./DistributorRoutes";

export default function index() {
  let routes;
  const isAuthenticated = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  console.log("role", role);

  if (isAuthenticated) {
    switch (role) {
      case USER_DISTRIBUTOR:
        routes = <DistributorRoutes />;
        break;
      case USER_CONTRACTOR:
        routes = <ContractorRoutes />;
        break;
      default:
        routes = <AdminRoutes />;
        break;
    }
  } else {
    routes = <LoginRoutes />;
  }

  return <Switch>{routes}</Switch>;
}
