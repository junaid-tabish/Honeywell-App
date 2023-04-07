import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerUser } from "../../../Services/Auth/Controller";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import "./register.css";
import { Card, CardContent } from "@material-ui/core";
import { TOSTIFY_TIME, USER_CONTRACTOR, USER_DISTRIBUTOR } from "../../../Utils/Constants";
import { useState } from "react";
import { registration } from "../../../Validations/ValidationRules";

const initialValues = {
  email: "",
  password: "",
  name: "",
  passwordConfirmation: "",
  role: "",
  tc: true,
};

export default function Registration() {
  const { values, errors, touched, handleBlur, handleChange, setErrors, setTouched } = useFormik({
    initialValues,
    validationSchema: registration,
    onSubmit: (values, action) => {
      action.resetForm();
    },
  });
  const history = useHistory();

  const [showPassword, setShowPassword] = useState(false);
  const handlePassword = (event) => {
    event.stopPropagation();
    setShowPassword(!showPassword);
  };

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleConfirmPassword = (event) => {
    event.stopPropagation();
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    registerUser(values)
      .then((res) => {
        if (Number(res.data.status) === 1) {
          toast.success(res.data.message);
          setTimeout(() => {
            history.push("/");
          }, TOSTIFY_TIME);
        } else if (Number(res.data.status) === 0) {
          if (res.data.data && res.data.data.errors?.length !== 0) {
            let tempErrors = { ...errors };
            // eslint-disable-next-line array-callback-return
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
    <div className="registermaindiv ">
      {console.log(errors)}
      <div className="bg-white regd-form ">
        <h3
          className="text-uppercase text-center py-2 text-white m-0"
          style={{
            backgroundColor: "#3f51b5",
          }}
        >
          Sign Up
        </h3>
        <form className="bg-white px-4 py-3  ">
          <div className="mb-2">
            <label className="mb-1">
              {" "}
              Name<span style={{ color: "red" }}>*</span>
            </label>
            <input type="text" name="name" id="name" className="form-control" placeholder="Name" value={values.name} onChange={handleChange} onBlur={handleBlur} />

            <p className="from-error">{errors.name && touched.name ? errors.name : null}</p>
          </div>

          <div className="mb-2">
            <label className="mb-1">
              Email address<span style={{ color: "red" }}>*</span>
            </label>
            <input type="email" name="email" id="email" className="form-control" placeholder="Enter email" value={values.email} onChange={handleChange} onBlur={handleBlur} />

            <p className="from-error">{errors.email && touched.email ? errors.email : null}</p>
          </div>

          <div className="mb-2 ">
            <label className="mb-1">
              Password<span style={{ color: "red" }}>*</span>
            </label>
            <div className="password-eye">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                className="form-control"
                placeholder="Enter password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span onClick={(e) => handlePassword(e)} className="icon password-eye__icon">
                {showPassword ? <i className="fa fa-eye"></i> : <i className="fa fa-eye-slash"></i>}
              </span>
            </div>
            <p className="from-error">{errors.password && touched.password ? errors.password : null}</p>
          </div>

          <div className="mb-2 ">
            <label className="mb-1">
              Confirm Password<span style={{ color: "red" }}>*</span>
            </label>

            <div className="password-eye">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="passwordConfirmation"
                id="passwordConfirmation"
                className="form-control"
                placeholder="Enter password"
                value={values.passwordConfirmation}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span onClick={(e) => handleConfirmPassword(e)} className="icon password-eye__icon">
                {showConfirmPassword ? <i className="fa fa-eye"></i> : <i className="fa fa-eye-slash"></i>}
              </span>
            </div>

            <p className="from-error">{errors.passwordConfirmation && touched.passwordConfirmation ? errors.passwordConfirmation : null}</p>
          </div>

          <div className="mb-3">
            <label>Select Role</label>
            <select className="form-control" type="text" name="role" id="role" value={values.role} onChange={handleChange} onBlur={handleBlur} required>
              <option hidden> Select Role</option>
              <option value={USER_DISTRIBUTOR}>Distributor</option>
              <option value={USER_CONTRACTOR}>Contractor</option>
            </select>
            <p className="from-error">{errors.role && touched.role ? errors.role : null}</p>
          </div>
          <p>
            Already have an account ? <a href="/">Login Here</a>
          </p>
          <ToastContainer />
          <div className="d-grid">
            <center>
              {" "}
              <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                Sign Up
              </button>
            </center>
          </div>
        </form>
      </div>
    </div>
  );
}
