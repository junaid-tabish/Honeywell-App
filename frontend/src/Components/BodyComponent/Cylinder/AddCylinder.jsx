import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { addCylinder } from "../../../Services/Admin/Cylinder/Controller";
import { ToastContainer, toast } from "react-toastify";
import { generateCylinderId, getBatchDetails } from "../../../Services/Admin/Cylinder/Controller";
import { TOSTIFY_TIME } from "../../../Utils/Constants";
import { useHistory } from "react-router-dom";
import "./AddCylinder.css";
import { Card, CardContent } from "@material-ui/core";
import BreadCrum from "../../CommonComponent/BreadCrum/BreadCrum";
import { useLocation } from "react-router-dom";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

export default function AddBatches() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    batchId: "",
    cylinderId: "",
    filledStatus: "filled",
    replacementRequest: 0,
    status: "active",
  });
  const [showBatchErr, setBatchErr] = useState(false);
  const [showCylinderIdErr, setCylinderErr] = useState(false);
  const [batchData, setBatchData] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const { batchId, filledStatus, replacementRequest, status, cylinderId } = formData;

  const location = useLocation();
  const [breadcumData, setbreadcumData] = useState(location.state);

  const onchange = (event) => {
    setBatchErr(false);
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const onSubmitDetails = async (event) => {
    event.preventDefault();
    if (batchId === "") {
      setBatchErr(true);
      return;
    }
    if (cylinderId === "") {
      setCylinderErr(true);
      return;
    }
    let filledValue = "";
    if (filledStatus === "filled") {
      filledValue = 1;
    } else if (filledStatus === "empty") {
      filledValue = 0;
    } else {
      filledValue = 2;
    }

    const data = {
      batchId: batchId,
      cylinderId: cylinderId,
      filledStatus: filledValue,
      replacementRequest: 0,
      status: status === "active" ? 1 : 0,
    };
    const response = await addCylinder(data);
    if (response.data.status === 1) {
      toast.success(response.data.message);
      setFormData({ ...formData, batchId: "", cylinderId: "" });
      setTimeout(() => {
        history.push(`/${localStorage.getItem("role").toLowerCase()}/cylinder`);
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

  const fetchBatchDetails = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const response = await getBatchDetails();
    if (response.status === 200) {
      if (response.data.status === 1) {
        setApiStatus(apiStatusConstants.success);
        const activeBatch = response.data.data.filter((eachObj) => eachObj["status"] === 1);
        setBatchData(activeBatch);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    fetchBatchDetails();
  }, []);

  const batchLoading = () => {
    return <input type="text" placeholder="Fetching Batch Details, Please Wait..." disabled />;
  };
  const batchFailure = () => {
    return (
      <select>
        <option>No Batch Details Found... </option>
      </select>
    );
  };

  const batchSuccess = () => {
    return (
      <select name="batchId" onChange={onchange} value={batchId} className={showBatchErr ? "err" : ""}>
        <option value="" disabled selected>
          Select Batch from below...
        </option>
        {batchData.map((eachObj) => {
          return <option value={eachObj["_id"]}>{eachObj["batchName"]}</option>;
        })}
      </select>
    );
  };

  const renderBatchData = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return batchSuccess();
      case apiStatusConstants.inProgress:
        return batchLoading();
      case apiStatusConstants.failure:
        return batchFailure();
      default:
        return <p>null</p>;
    }
  };

  const generateUniqueCylinderId = async () => {
    const response = await generateCylinderId();
    const cylinderEl = document.getElementById("cylinderId");
    cylinderEl.value = response.data.data;
    setFormData({ ...formData, cylinderId: response.data.data });
    setCylinderErr(false);
  };

  return (
    <>
      <ToastContainer />
      <h3>Add Cylinder</h3>
      {breadcumData && <BreadCrum breadcrumbs={breadcumData} />}
      <div>
        <Card
          style={{
            padding: "20px",
            borderRadius: "5px",
            border: "1px solid gray",
          }}
        >
          <CardContent>
            <div className="form-content col-12">
              <form className="requires-validation" noValidate onSubmit={onSubmitDetails}>
                <div className="col-md-12">
                  <label htmlFor="batchId" className="mb-0 batch-lable">
                    Batch Id
                  </label>
                  {renderBatchData()}
                </div>
                <div className="col-md-12">
                  <div className="cylinderid-container">
                    <input type="text" value={cylinderId} className={showCylinderIdErr ? "err" : ""} disabled placeholder="Generate Cylinder Id" id="cylinderId" readOnly />
                    <button type="button btn-primary" onClick={generateUniqueCylinderId}>
                      Generate
                    </button>
                  </div>
                </div>
                <div className="col-md-12 mt-3">
                  <span className="mb-3 mr-1 text-dark">Filled Status: </span>
                  <input type="radio" name="filledStatus" value="filled" id="filledStatusTrue" defaultChecked onChange={onchange} />
                  <label className="btn btn-sm btn-outline-secondary ml-1 mr-4" htmlFor="filledStatusTrue">
                    Filled
                  </label>
                  <input type="radio" name="filledStatus" id="filledStatusFalse" value="empty" onChange={onchange} />
                  <label className="btn btn-sm btn-outline-secondary ml-1 mb-0 mr-4" htmlFor="filledStatusFalse">
                    Empty
                  </label>
                  <input type="radio" name="filledStatus" id="filledStatusLessGas" value="lessGas" onChange={onchange} />
                  <label className="btn btn-sm btn-outline-secondary ml-1 mb-0" htmlFor="filledStatusLessGas">
                    Less Gas
                  </label>
                </div>
                <div className="col-md-12 mt-3">
                  <span className="mb-3 mr-1 text-dark">Status: </span>
                  <input type="radio" name="status" id="active" defaultChecked value="active" onChange={onchange} />
                  <label className="btn btn-sm btn-outline-secondary ml-1 mr-4" htmlFor="active">
                    Active
                  </label>
                  <input type="radio" name="status" id="Inactive" value="inactive" onChange={onchange} />
                  <label className="btn btn-sm btn-outline-secondary ml-1 mb-0" htmlFor="Inactive">
                    In Active
                  </label>
                </div>

                <div className="form-button d-flex align-item-center justify-content-center">
                  <button id="submit" type="submit" className="btn btn-primary">
                    Submit
                  </button>
                  <Link to={`/${localStorage.getItem("role").toLowerCase()}/cylinder`}>
                    <button id="submit" type="button" className="btn btn-primary ml-4">
                      Cancle
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
