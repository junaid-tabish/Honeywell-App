import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useHistory, useLocation, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  Addsite,
  GetDistributor,
  getcontractorsallocatedtodistributor,
} from "../../../Services/Admin/Sites/Controller";
import { TOSTIFY_TIME } from "../../../Utils/Constants";
import { useFormik } from "formik";

import BreadCrum from "../../CommonComponent/BreadCrum/BreadCrum";
import { Site } from "../../../Validations/ValidationRules";
import jwtDecode from "jwt-decode";

const initialValues = {
  siteName: "",
  latitude: "",
  longitude: "",
  status: "",
};

export default function AddSite() {
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    setErrors,
    setTouched,
  } = useFormik({
    initialValues,
    validationSchema: Site,
    onSubmit: (values, action) => {
      action.resetForm();
    },
  });
  const [disData, setdisData] = useState([]);
  const [conData, setConData] = useState([]);
  const history = useHistory();
  const location = useLocation();
  const [breadcumData, setbreadcumData] = useState(location.state);
  const [selects, setSelects] = useState({
    distributorId: "",
    contractorId: "",
  });
  const [status, setStatus] = React.useState(1);
  const { id } = useParams();

  const handleOnStatus = (event) => {
    setStatus(parseInt(event.target.value));
  };

  useEffect(() => {
    GetDistributor().then((res) => {
      setdisData(res.data.data);
    });

    if (localStorage.getItem("role") == "Distributor") {
      const tok = jwtDecode(localStorage.getItem("token"));
      setSelects({ ...selects, distributorId: tok.userID });
      getcontractorsallocatedtodistributor(tok.userID).then((res) => {
        setConData(res.data.data);
        console.log(res.data.data);
      });

      console.log(jwtDecode(localStorage.getItem("token")));
    } else if (localStorage.getItem("role") == "Contractor") {
      const tok = jwtDecode(localStorage.getItem("token"));
      console.log(tok);
    }
    console.log(selects);
  }, []);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    values.status = status;
    let data = {
      ...values,
      ...selects,
    };
    console.log(data);
    Addsite(data)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.message);
          setTimeout(() => {
            history.push(`/${localStorage.getItem("role").toLowerCase()}/site`);
          }, TOSTIFY_TIME);
        } else if (res.data.status === 0) {
          if (res.data.data && res.data.data.errors?.length !== 0) {
            let tempErrors = { ...errors };

            res.data.data.errors?.map((ele) => {
              tempErrors = { ...tempErrors, [ele.param]: ele.msg };
            });
            setErrors({ ...tempErrors });
            setTouched({ ...tempErrors });
          } else {
            toast.error(res.data.message);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <h3>Add Site</h3>
      {breadcumData && <BreadCrum breadcrumbs={breadcumData} />}
      <form
        className="row bg-white px-sm-3 py-2 py-ms-4 rounded-3 mt-2 mt-sm-0 m-sm-2"
        style={{ border: "1px solid black", borderRadius: "5px" }}
      >
        <div className="col-12">
          <label>
            Site Name<span style={{ color: "red" }}>*</span>
          </label>
          <input
            className="form-control"
            type="text"
            name="siteName"
            id="siteName"
            value={values.siteName}
            placeholder="Site Name"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <p className="from-error">
            {errors.siteName || touched.siteName ? errors.siteName : null}
          </p>
        </div>

        <div className="col-12">
          <label>
            Latitude<span style={{ color: "red" }}>*</span>
          </label>
          <input
            className="form-control"
            type="text"
            name="latitude"
            id="latitude"
            value={values.latitude}
            placeholder="Latitude"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <p className="from-error">
            {errors.latitude || touched.latitude ? errors.latitude : null}
          </p>
        </div>

        <div className="col-12">
          <label>
            Longitude<span style={{ color: "red" }}>*</span>
          </label>
          <input
            className="form-control"
            type="text"
            name="longitude"
            id="longitude"
            value={values.longitude}
            placeholder="Longitude"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <p className="from-error">
            {errors.longitude || touched.longitude ? errors.longitude : null}
          </p>
        </div>

        {localStorage.getItem("role") !== "Distributor" &&
        localStorage.getItem("role") !== "Contractor" ? (
          <div className="col-12">
            <label className="mb-1">
              Distributor<span style={{ color: "red" }}>*</span>
            </label>
            <select
              value={selects.distributorId}
              onChange={(e) => {
                setSelects({ ...selects, distributorId: e.target.value });
                getcontractorsallocatedtodistributor(e.target.value).then(
                  (res) => {
                    setConData(res.data.data);
                    console.log(res.data.data);
                  }
                );
              }}
              className="form-control"
              type="text"
              name="distributorId"
              id="distributorId"
              onBlur={handleBlur}
              required
            >
              <option hidden>Select Distributor</option>
              {disData.map((ele) => (
                <option value={ele._id}>{ele.name}</option>
              ))}
            </select>{" "}
          </div>
        ) : (
          ""
        )}

        {localStorage.getItem("role") !== "Contractor" ? (
          <div className="col-12">
            <label className="mb-1">
              Contractor<span style={{ color: "red" }}>*</span>
            </label>
            <select
              className="form-control"
              type="text"
              name="contractorId"
              id="contractorId"
              value={selects.contractorId}
              onChange={(e) => {
                setSelects({ ...selects, contractorId: e.target.value });
              }}
              onBlur={handleBlur}
              required
            >
              <option hidden>Select Contractor</option>
              {conData.map((element) => (
                <option value={element._id}>{element.name}</option>
              ))}
            </select>
          </div>
        ) : (
          ""
        )}
        <div className="col-12 mt-3">
          <span className="mb-3 mr-1 text-dark" htmlFor="status">
            Status:{" "}
          </span>
          Active:&nbsp;
          <input
            type="radio"
            className="btn-check"
            name="status"
            checked={status}
            onChange={handleOnStatus}
            value="1"
            id="active"
            autoComplete="off"
            required
          />
          &nbsp;&nbsp; InActive :&nbsp;
          <input
            type="radio"
            className="btn-check"
            checked={!status}
            value="0"
            name="status"
            id="inActive"
            autoComplete="off"
            required
            onChange={handleOnStatus}
          />
        </div>
        <ToastContainer />
        <div className="form-button mt-3 px-3 d-flex align-item-center justify-content-end">
          <button
            id="submit"
            type="submit"
            className="btn btn-info"
            onClick={handleOnSubmit}
          >
            Submit
          </button>
          <Link to={`/${localStorage.getItem("role").toLowerCase()}/site`}>
            <button id="submit" type="submit" className="btn btn-info ml-4">
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </>
  );
}
