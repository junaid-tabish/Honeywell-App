import React from "react";
import ForgotPassword from "../Components/AuthComponent/ForgotPassword/ForgotPassword";
import Login from "../Components/AuthComponent/Login/Login";
import Registration from "../Components/AuthComponent/Registration/Registration";
import { Route, Switch } from "react-router-dom";
import ResetPassword from "../Components/AuthComponent/ResetPassword/ResetPassword";
import NotFound from "../Components/CommonComponent/NotFound/NotFound";

export default function LoginRoutes() {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/register" component={Registration} />
      <Route exact path="/forgotPassword" component={ForgotPassword} />
      <Route exact path="/reset/:id/:token" component={ResetPassword} />
      <Route component={NotFound} />
    </Switch>
  );
}
