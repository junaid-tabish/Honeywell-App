import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Avatar } from "@material-ui/core";
import { Link, useLocation } from "react-router-dom";
import "./distributorStyle.css";
import { useEffect } from "react";
import { getDistributorById } from "../../../Services/Distributor/Controller";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import BreadCrum from "../../CommonComponent/BreadCrum/BreadCrum";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function ViewDistributor() {
  const Query = useQuery();
 
  const [values, setValues] = useState();

 
  const location = useLocation();

  useEffect(() => {
    setValues(location.state.row);
  }, []);

  const [breadcumData, setbreadcumData] = useState(location.state.breadCrum);


  return (
    <>
    <h3>View Distributor</h3>
    {breadcumData && <BreadCrum breadcrumbs={breadcumData} />}
   
    <div className="view">
       
      <Card className="Viewcard"    sx={{ padding: 5, border: "3px solid gray", boxShadow: "0px 6px 8px 2px rgba(38, 37, 37, 0.51)" }}>
        <CardMedia>
          <center><Avatar className="avatar">D</Avatar></center>
        </CardMedia>
        <CardContent>
         <center>
         <Typography gutterBottom variant="h3" sx={{ padding: 2 }}>
            Distributor
          </Typography>
         </center>
          <Typography variant="body2" color="text">
            <ul>
              <li> Distributor Name : {values && values.name}</li>
              <li> Email :{values && values.email} </li>
              <li> Role : {values && values.role}</li>
            </ul>
          </Typography>
        </CardContent>
        <CardActions>
          <ToastContainer />
          <Link to={`/${localStorage.getItem("role").toLowerCase()}/distributor`}>
            <center className="buttonV">
              <button className="btn btn-primary ml-4">Cancel</button>
            </center>
          </Link>
        </CardActions>
      </Card>
    </div>
    </>
  );
}
