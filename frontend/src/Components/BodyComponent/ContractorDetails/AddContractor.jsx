import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { addContractorDetails } from "../../../Services/Admin/Contractor/Controller";
import { USER_CONTRACTOR } from "../../../Utils/Constants.js";

import { ToastContainer, toast } from "react-toastify";
import { TOSTIFY_TIME } from "../../../Utils/Constants";
import { useHistory, useLocation } from "react-router-dom";

import "./addContractor.css";
import { getActiveDistributors } from "../../../Services/Admin/Distributor/Controller.js";
import BreadCrum from "../../CommonComponent/BreadCrum/BreadCrum.js";
import jwtDecode from "jwt-decode";
import {Card, CardContent} from "@material-ui/core";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

export default function AddContractor() {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [distributorsData, setDistributorsData] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", role: USER_CONTRACTOR, password: "", distributorId: "" });
  const [errData, setErrData] = useState({ nameErr: false, emailErr: false, roleErr: false, passwordErr: false, distributorIdErr: false });
  const [formValidation, setValidation] = useState(false);
  let { name, email, role, password, distributorId } = formData;
  let { nameErr, emailErr, passwordErr, distributorIdErr } = errData;
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();

  const location = useLocation();
  const [breadcumData, setbreadcumData] = useState(location.state);

  const token =  jwtDecode(localStorage.getItem("token"))
        const distId = token.userID

  const handlePassword = (event) => {
    event.stopPropagation();
    setShowPassword(!showPassword);
  };

  const onblur = (e) => {
    if (e.target.value === "") {
      setErrData({ ...errData, [`${e.target.name}Err`]: true });
    } else {
      setErrData({ ...errData, [`${e.target.name}Err`]: false });
    }
  };

  const onchange = (e) => {
    if (e.target.value !== "") {
      setErrData({ ...errData, [`${e.target.name}Err`]: false });
    }
    setFormData({ ...formData, [`${e.target.name}`]: e.target.value });
  };

  const checkFormValidations = () => {
    if (name === "" || email === "" || role === "" || password === "" || distributorIdErr === "") {
      setValidation(true);
      return true;
    } else {
      setValidation(false);
    }
  };

  const onSubmitDetails = async (event) => {
    event.preventDefault();
    if (name === "") {
      setErrData((prevState) => ({ ...prevState, nameErr: true }));
    }
    if (email === "") {
      setErrData((prevState) => ({ ...prevState, emailErr: true }));
    }
    if (role === "") {
      setErrData((prevState) => ({ ...prevState, roleErr: true }));
    }
    if (password === "") {
      setErrData((prevState) => ({ ...prevState, passwordErr: true }));
    }
    if (distributorId === "") {
      setErrData((prevState) => ({ ...prevState, distributorIdErr: true }));
    }
    const val = checkFormValidations();
    if (val) {
      return;
    }
    const data = {
      name: name.trim(),
      email: email.trim(),
      role: role,
      password: password.trim(),
      distributorId: localStorage.getItem("role").toLowerCase()==="admin" ? distributorId : distId,
    };

    const response = await addContractorDetails(data);
    console.log(response)

    if (response.data.status === 1) {
    
      toast.success(response.data.message);
      setFormData({ ...formData, batchId: "", cylinderId: "" });
      setTimeout(() => {
        history.push(`/${localStorage.getItem("role").toLowerCase()}/contractor`);
      }, TOSTIFY_TIME);
    } else if (response.data.status === 0) {
      let message = "";
      if (typeof response.data.data === "string") {
        message = response.data.message;
      } else {
        message = response.data.data.errors[0].msg;
      }
      toast.error(message);
    }
  };
let  flag=2;
  const fetchDistributore = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const response = await getActiveDistributors();
    if (response.data.status === 1) {
      setApiStatus(apiStatusConstants.success);
      setDistributorsData(response.data.data);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    fetchDistributore();
  }, []);

  const distributorLoading = () => {
    return <input type="text" placeholder="Fetching Distributor Details, Please Wait..." disabled />;
  };
  const distributorFailure = () => {
    return (
      <select>
        <option disabled>No Distributors Details Found... </option>
      </select>
    );
  };

  const distributorSuccess = () => {
    return (
      <select name="distributorId" id="distributorId" className={distributorIdErr ? "err-border mt-0" : "mt-0"} onBlur={onblur} onChange={onchange}>
        <option disabled selected value="">
          Select Distributor from below...
        </option>
        {distributorsData.map((eachObj) => {
          return <option value={eachObj["_id"]}>{eachObj["name"]}</option>;
        })}
      </select>
    );
  };

  const renderDistributorData = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return distributorSuccess();
      case apiStatusConstants.inProgress:
        return distributorLoading();
      case apiStatusConstants.failure:
        return distributorFailure();
      default:
        return <p>null</p>;
    }
  };

  return (
    <>
            <h3>Add Contractor</h3>
      <ToastContainer />
      {breadcumData && <BreadCrum breadcrumbs={breadcumData} />}
     <div>
     <div>
      <Card
            style={{
              padding: "20px",
              borderRadius: "5px",
              border: "1px solid gray",
            }}
          >
            <CardContent>
      
            
                <form onSubmit={onSubmitDetails}>
                <div className="form-content">
              
                 
                {localStorage.getItem("role").toLowerCase()==="admin" &&
                     <div className="col-md-12">
                    <label htmlFor="distributorId" className="label-text mb-0">
                      Distributor
                    </label>
                    {renderDistributorData()}               
                     </div> }
                    
                  <div className="col-md-12 mt-2">
                    <label htmlFor="fullName" className="label-text">
                      Full Name
                    </label>
                    <input
                      className={nameErr ? "form-control err-border" : "form-control"}
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      id="fullName"
                      onBlur={onblur}
                      value={name}
                      onChange={onchange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="email" className="label-text">
                      Email
                    </label>
                    <input
                      id="email"
                      className={emailErr ? "form-control err-border" : "form-control"}
                      type="email"
                      name="email"
                      placeholder="E-mail Address"
                      required
                      onBlur={onblur}
                      value={email}
                      onChange={onchange}
                    />
                  </div>
                  {/* <div className="col-md-12 ">
                    <label htmlFor="role" className="label-text mb-0">Role</label>
                    <select id="role" className={roleErr? 'err-border mt-0': 'mt-0'} 
                      onBlur={onblur} value={role} onChange={onchange} required name="role">
                      <option selected disabled  value='' >Select Role</option>
                      <option value="contractor">Contractor</option>
                    </select>
                  </div> */}
                  <div className="col-md-12">
                    <label htmlFor="password" className="label-text mt-2">
                      Password
                    </label>
                    <input
                      id="password"
                      className={passwordErr ? "form-control err-border" : "form-control"}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      required
                      onBlur={onblur}
                      value={password}
                      onChange={onchange}
                    />
                    <span onClick={(e) => handlePassword(e)} className="eicon">
                      {showPassword ? <i className="fa fa-eye"></i> : <i className="fa fa-eye-slash"></i>}
                    </span>
                  </div>
                 
                  <div className="col-md-12">{formValidation && <span className="text-danger">All feilds required*</span>}</div>

                  
                  <div className="form-button mt-3 px-3 d-flex align-item-center justify-content-center">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                    <Link to={`/${localStorage.getItem("role").toLowerCase()}/contractor`}>
                      <button type="button" className="btn btn-primary ml-4">
                        Cancel
                      </button>
                    </Link>
                  </div>
                  </div>
                </form>
              
           
          
      </CardContent>
      </Card>
      </div>
      </div>
    </>
  );
}
