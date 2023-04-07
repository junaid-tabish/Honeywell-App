import { Card, CardContent } from "@material-ui/core";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { updateContractor } from "../../../Services/Admin/Contractor/Controller";
import { TOSTIFY_TIME, USER_CONTRACTOR } from "../../../Utils/Constants";
import { Contractor } from "../../../Validations/ValidationRules";
import BreadCrum from "../../CommonComponent/BreadCrum/BreadCrum";
import { getActiveDistributors } from "../../../Services/Admin/Distributor/Controller";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

export default function UpdateDistributor() {
  const [initialValues, setInitialValues] = useState({
    email: "",
    name: "",
    role: USER_CONTRACTOR,
    password: "",
    status: "",
  });
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [distributorsData, setDistributorsData] = useState([]);

  const params = useParams();
  const id = params.id;

  const { values, errors, touched, handleBlur, handleChange, setValues } =
    useFormik({
      initialValues,
      validationSchema: Contractor,
      onSubmit: (values, action) => {
        action.resetForm();
      },
    });
  const history = useHistory();

  const location = useLocation();

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

  useEffect(() => {
    setValues(location.state.row);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await updateContractor(id, values);
    if (Number(res.data.status) === 1) {
      toast.success(res.data.message);
      setTimeout(() => {
        history.push(
          `/${localStorage.getItem("role").toLowerCase()}/contractor`
        );
      }, TOSTIFY_TIME);
    } else {
      toast.error(res.data.message);
    }
  };
  const [breadcumData, setbreadcumData] = useState(location.state.breadCrum);

  const distributorLoading = () => {
    return (
      <input
        type="text"
        placeholder="Fetching Distributor Details, Please Wait..."
        disabled
      />
    );
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
      <select name="distributorId" id="distributorId" onChange={handleChange} className="form-control">
        <option disabled selected value="">
          Select Distributor from below...
        </option>
        {distributorsData.map((eachObj) => {
          const active = values.distributorId === eachObj._id 
          return <option value={eachObj["_id"]} selected={active? true: false}  >{eachObj["name"]}</option>;
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
            <h3>Update Contractor</h3>

      {breadcumData && <BreadCrum breadcrumbs={breadcumData} />}
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
                <div className="d-flex flex-column">
                  <label htmlFor="distributorId">
                    Distributor
                  </label>
                  {renderDistributorData()}
                </div>
                <div>
                  <label> Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="form-control"
                    placeholder="Name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <p className="from-error">
                    {errors.name && touched.name ? errors.name : null}
                  </p>
                </div>

                <div>
                  <label>Email address</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <p className="from-error">
                    {errors.email && touched.email ? errors.email : null}
                  </p>
                </div>
                <div>
                  <span className="mb-3 mr-1 text-dark">Status: </span>
                  <input
                    type="radio"
                    className="btn-check"
                    name="status"
                    id="active"
                    autoComplete="off"
                    checked={values.status === 1 || values.status === "1"}
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={1}
                  />
                  <label
                    className="btn btn-sm btn-outline-secondary ml-3 mr-3"
                    htmlFor="active"
                  >
                    Active
                  </label>
                  <input
                    type="radio"
                    className="btn-check"
                    name="status"
                    id="inavtive"
                    value={0}
                    autoComplete="off"
                    required
                    checked={values.status === 0 || values.status === "0"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <label
                    className="btn btn-sm btn-outline-secondary ml-3 mb-0"
                    htmlFor="inavtive"
                  >
                    In Active
                  </label>
                </div>
                <ToastContainer />
                <div className="d-grid">
                  <center>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                    <Link
                      to={`/${localStorage
                        .getItem("role")
                        .toLowerCase()}/contractor`}
                    >
                      <button className="btn btn-primary ml-4">Cancel</button>
                    </Link>
                  </center>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
