import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useHistory, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router";
import { Updatesite } from "../../../Services/Admin/Sites/Controller";
import { TOSTIFY_TIME } from "../../../Utils/Constants";
import BreadCrum from "../../CommonComponent/BreadCrum/BreadCrum";
import { useFormik } from "formik";
import { Site } from "../../../Validations/ValidationRules";

var initialValues = {
  siteName: "",
  latitude: "",
  longitude: "",
  status: "",
};
export default function UpdateSite() {
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    setErrors,
    setTouched,
    setValues,
  } = useFormik({
    initialValues,
    validationSchema: Site,
    onSubmit: (values, action) => {
      action.resetForm();
    },
  });
  useEffect(() => {
    setValues(location.state.pro);
  }, []);
  const history = useHistory();
  const location = useLocation();
  const [prevData, setPrevData] = useState(location.state.pro);
  const [breadcumData, setbreadcumData] = useState(location.state.breadCrum);

  let { id } = useParams();

  const handleOnStatus = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
    setValues({ ...values, [name]: parseInt(value) });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    Updatesite(id, values).then((res) => {
      console.log("result", res.data);

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
    });
  };

  return (
    <>
      <h3 className="form-title">Update Site</h3>
      {breadcumData && <BreadCrum breadcrumbs={breadcumData} />}

      <form
        className="row bg-white mt-3 mx-2 px-2 py-4"
        style={{ border: "1px solid black", borderRadius: "5px" }}
      >
        <div className="col-12">
          <label>
            Site Name<span style={{ color: "red" }}>*</span>
          </label>
          <input
            className="form-control"
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            name="siteName"
            id="siteName"
            placeholder="Site Name"
            value={values.siteName}
            required
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
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.latitude}
            name="latitude"
            id="latitude"
            placeholder="Latitude"
            required
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
            onChange={handleChange}
            onBlur={handleBlur}
            name="longitude"
            id="longitude"
            placeholder="Longitude"
            value={values.longitude}
            required
          />
          <p className="from-error">
            {errors.longitude || touched.longitude ? errors.longitude : null}
          </p>
        </div>

        <div className="col-12 mt-3">
          <span className="mb-3 mr-1 text-dark" htmlFor="status">
            Status:{" "}
          </span>
          Active:&nbsp;
          <input
            type="radio"
            className="btn-check"
            name="status"
            value="1"
            checked={values.status}
            onChange={handleOnStatus}
            id="active"
            autoComplete="off"
            required
          />
          &nbsp;&nbsp; InActive :&nbsp;
          <input
            type="radio"
            className="btn-check"
            value="0"
            checked={!values.status}
            name="status"
            id="inActive"
            autoComplete="off"
            required
            onChange={handleOnStatus}
          />
        </div>
        <ToastContainer />
        <div className="form-button mt-3 px-3 d-flex align-item-center justify-content-center">
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
