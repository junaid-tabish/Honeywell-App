import React, { useRef } from 'react'
import { Link, useLocation } from "react-router-dom";

import {
  updateSites,
  siteToBeAlloted,
  getContractor,
} from "../../../Services/Admin/Contractor/Controller.js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import { TOSTIFY_TIME } from "../../../Utils/Constants.js";
import { useHistory } from "react-router-dom";
import { CardContent, Card } from "@mui/material";
import BreadCrum from "../../CommonComponent/BreadCrum/BreadCrum.js";



export default function AllotSites() {
  const isMounted = useRef(false);
  const [sites, setSites] = useState([]);
  const [updatedSites, setUpdatedSites] = useState([]);
  const [details, setDetails] = useState([]);
  const [isValid, setIsValid] = useState(false);

  const { id } = useParams();
  const history = useHistory();
  const location = useLocation()

  const breadcrumbs = [
    { title: 'Dashboard', link: `/${localStorage.getItem("role").toLowerCase()}/dashboard`, active: 0 },
    { title: 'Contractor', link: `/${localStorage.getItem("role").toLowerCase()}/contractor`, active: 0 },
    { title: 'Manage Sites', link: `/${localStorage.getItem("role").toLowerCase()}/contractor/managesites/${id}`, active: 0 },
    { title: 'Allot Sites', link: `/${localStorage.getItem("role").toLowerCase()}/contractor/allotsites/${id}`, active: 1 },
  ];

  useEffect(() => {
    getAllSites();
    getContractorDetails();
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      setIsValid(updatedSites.length == 0 ? true : false);
    } else {
      isMounted.current = true;
    }
  }, [updatedSites]);

  const getAllSites = async () => {
    const res = await siteToBeAlloted(id);
    setSites(res.data.data);
  };
  const getContractorDetails = async () => {
    const res = await getContractor(id);
    setDetails(res.data.data);
  };

  const allsites = sites.map(getsitename);
  function getsitename(sites) {
    return { value: sites._id, label: sites.siteName };
  }

  const handleChange = (selectedOption) => {
    setUpdatedSites(selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updatedSites.length == 0) {
      setIsValid(true)
      return;
    }
    const finalSites = updatedSites.map(getsitename);
    function getsitename(updateSites) {
      return updateSites.value;
    }
    const res = await updateSites(id, finalSites);

    if (Number(res.data.status) === 1) {
      toast.success(res.data.message);
      setTimeout(() => {
        history.push({
          pathname: `/${localStorage.getItem("role").toLowerCase()}/contractor/managesites/${id}`
        });
      }, TOSTIFY_TIME);
    } else {
      toast.error(res.data.message);
    }
  };

  return (
    <>


      <h3> Allocate Site To Contractor</h3>
      {breadcrumbs && <BreadCrum breadcrumbs={breadcrumbs} />}
      <div>

        <div>
          <Card
            style={{
              padding: "20px",
              borderRadius: "5px",
              border: "1px solid",
            }}
          >
            <CardContent>
              <form>
                <div>
                  <h4>Contractor Details:</h4>
                </div>
                <div className="p-3">
                  <label> Name: {details.name}</label>
                </div>
                <ToastContainer />
                <div className="d-grid">
                  <h5>Select Sites :</h5>
                  <center>
                    {" "}
                    <div>
                      <Select styles={{ width: 50 }} options={allsites} onChange={handleChange} isMulti required />
                      {isValid && <span className="text-danger pull-left">You must select a site*</span>}
                    </div>
                    <div className="p-5">
                      <button type="submit" onClick={handleSubmit} className="btn btn-primary ">
                        Assign
                      </button>
                      <Link
                        to={`/${localStorage
                          .getItem("role")
                          .toLowerCase()}/contractor/managesites/${id}`}
                      >
                        <button className="btn btn-primary ml-4">Cancel</button>
                      </Link>
                    </div>
                  </center>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

    </>

  )

};
