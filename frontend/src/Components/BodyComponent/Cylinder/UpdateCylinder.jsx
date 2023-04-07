import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { getCylinder, getBatchDetails, updateBatchDetails } from "../../../Services/Admin/Cylinder/Controller";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { TOSTIFY_TIME } from "../../../Utils/Constants";
import "./AddCylinder.css";
import { Card, CardContent } from "@material-ui/core";
import BreadCrum from "../../CommonComponent/BreadCrum/BreadCrum";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

export default function UpdateBatches() {
  const [cylinderData, setCylinderData] = useState([]);
  const [batchData, setBatchData] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const params = useParams();
  const location = useLocation();
  const id = params.id;

  const history = useHistory();

  const [breadcumData, setbreadcumData] = useState(location.state.breadCrum);

  const onchange = (event) => {
    setCylinderData({ ...cylinderData, [event.target.name]: event.target.value });
  };

  const fetchCylinderDetails = useCallback(async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const response = await getCylinder(id);
    if (response.status === 200) {
      if (response.data.status === 1) {
        setApiStatus(apiStatusConstants.success);
        setCylinderData(response.data.data);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  }, [id]);

  useEffect(() => {
    fetchCylinderDetails();
  }, [fetchCylinderDetails]);

  const batchLoading = () => {
    return <input type="text" value="Fetching Batch Details, Please Wait..." dis />;
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
      <select name="batchId" className="mt-1" onChange={onchange}>
        {batchData.map((eachObj) => {
          return (
            <option value={eachObj["_id"]} selected={cylinderData["batchId"] === eachObj["_id"]}>
              {eachObj["batchName"]}
            </option>
          );
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

  const fetchBatchDetails = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const response = await getBatchDetails();
    if (response.status === 200) {
      if (response.data.status === 1) {
        setApiStatus(apiStatusConstants.success);
        setBatchData(response.data.data);
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

  const onSubmitUpdate = async (event) => {
    const { batchId, filledStatus, replacementRequest, status } = cylinderData;
    event.preventDefault();
    let filledValue = "";
    if (filledStatus === "Filled") {
      filledValue = 1;
    } else if (filledStatus === "Empty") {
      filledValue = 0;
    } else {
      filledValue = 2;
    }
    const formattedData = {
      batchId: batchId,
      filledStatus: filledValue,
      replacementRequest: 0 ,
      status: status === "Active" ? 1 : 0,
    };
    const response = await updateBatchDetails(id, formattedData);
    if (response.status === 200) {
      if (response.data.status === 1) {
        toast.success(response.data.message);
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
    } else {
      toast.error("Error");
    }
  };

  const showCylinderSuccessView = () => {
    const { filledStatus, _id, replacementRequest, status, cylinderId } = cylinderData;
    return (
      <>
        <ToastContainer />
        <h3>Update Cylinder</h3>
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
              <div className="form-content p-2">
               
                  <form className="requires-validation" noValidate onSubmit={onSubmitUpdate}>
                    <div className="col-md-12">
                      <label htmlFor="batchId" className="mb-0 batch-lable">
                        Batch Name
                      </label>
                      {renderBatchData()}
                    </div>
                    <div className="col-md-12">
                      <label htmlFor="cylinderId" className="mb-0 mt-3">
                        Cylinder Id <strong className="ml-4" style={{color:"red"}}>ReadOnly*</strong>
                      </label>
                      <input type="text" value={cylinderId} readOnly id="cylinderId" className="mt-1" />
                    </div>
                    <div className="col-md-12 mt-3">
                      <span className="mb-3 mr-1 text-dark">Filled Status: </span>
                      <input type="radio" name="filledStatus" value="Filled" id="filledStatusTrue" onChange={onchange} checked={filledStatus === "Filled"} />
                      <label className="btn btn-sm btn-outline-secondary ml-1 mr-4" htmlFor="filledStatusTrue">
                        Filled
                      </label>
                      <input type="radio" name="filledStatus" id="filledStatusFalse" value="Empty" onChange={onchange} checked={filledStatus === "Empty"} />
                      <label className="btn btn-sm btn-outline-secondary ml-1 mb-0 mr-4" htmlFor="filledStatusFalse">
                        Empty
                      </label>
                      <input type="radio" name="filledStatus" id="filledStatusLessGas" value="Less Gas" onChange={onchange} checked={filledStatus === "Less Gas"} />
                      <label className="btn btn-sm btn-outline-secondary ml-1 mb-0" htmlFor="filledStatusLessGas">
                        Less Gas
                      </label>
                    </div>
                    <div className="col-md-12 mt-3">
                      <span className="mb-3 mr-1 text-dark">Status: </span>
                      <input type="radio" name="status" id="active" checked={status === "Active"} value="Active" onChange={onchange} />
                      <label className="btn btn-sm btn-outline-secondary ml-1 mr-4" htmlFor="active">
                        Active
                      </label>
                      <input type="radio" name="status" id="Inactive" value="Inactive" onChange={onchange} checked={status === "Inactive"} />
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
  };

  const renderCylinderData = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return showCylinderSuccessView();
      case apiStatusConstants.inProgress:
        return <h1>Loading...</h1>;
      case apiStatusConstants.failure:
        return <h1>Something Went Wrong...</h1>;
      default:
        return <p>null</p>;
    }
  };

  return renderCylinderData();
}
