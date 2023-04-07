import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {Link} from 'react-router-dom'


function BreadCrum({ breadcrumbs }) {
  return (
    <>
      <Breadcrumbs separator=">" aria-label="breadcrumb">
        {breadcrumbs &&
          breadcrumbs.map((val) => {
            return !val.active ? (
              <Link underline="hover" color="inherit" to={val.link} >
                {val.title}
              </Link>
            ) : (
              <span>{val.title}</span>
            );
          })}
      </Breadcrumbs>
      <br/>
    </>
  );
}

export default BreadCrum;
