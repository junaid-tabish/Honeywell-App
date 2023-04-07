import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router";
import { loginUser } from "../../../Services/Auth/Controller";
import { login } from "../../../Validations/ValidationRules";
import {
  TOSTIFY_TIME,
  USER_ADMIN,
  USER_CONTRACTOR,
  USER_DISTRIBUTOR,
} from "../../../Utils/Constants";
import { useFormik } from "formik";
import "./login.css";
import { useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";

const initialValues = {
  email: "",
  password: "",
};

export default function Login() {
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
    validationSchema: login,
    onSubmit: (values, action) => {
      console.log(values);
      action.resetForm();
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const handlePassword = (event) => {
    event.stopPropagation();
    setShowPassword(!showPassword);
  };

  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(values)
      .then((res) => {
        console.log(res.data.data);
        if (res.data.status === 1) {
          toast.success(res.data.data.role + " Logged In");
          localStorage.setItem("token", res.data.data.token);
          localStorage.setItem("role", res.data.data.role);

          setTimeout(() => {
            if (res.data.data.role === USER_ADMIN) {
              history.push("/admin/dashboard");
            } else if (res.data.data.role === USER_DISTRIBUTOR) {
              history.push("/distributor/dashboard");
            } else if (res.data.data.role === USER_CONTRACTOR) {
              history.push("/contractor/dashboard");
            }
          }, TOSTIFY_TIME);
        } else if (res.data.status === 0) {
          console.log(res.data.data);
          if (res.data.data.errors.length !== 0) {
            let tempErrors = { ...errors };
            res.data.data.errors.map((ele) => {
              tempErrors = { ...tempErrors, [ele.param]: ele.msg };
            });
            setErrors({ ...tempErrors });
            setTouched({ ...tempErrors });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="loginmaindiv">
      <div>
        <h1 className="mainh1">WELCOME TO HONEYWELL</h1>
        <div className="bg-white mx-2 mx-sm-0">
          <h3 className="signin text-white text-center p-2 text-uppercase m-0">
            Sign In
          </h3>
          <form className="px-3 px-md-5 py-4">
            <div className="mb-3">
              <label className="mb-1 ">
                Email address<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && touched.email ? (
                <p className="from-error">{errors.email}</p>
              ) : null}
            </div>

            <div className="mb-3 password-container">
              <label className="mb-1">
                Password<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span onClick={(e) => handlePassword(e)} className="eye-icon ">
                {showPassword ? (
                  <i className="fa fa-eye"></i>
                ) : (
                  <i className="fa fa-eye-slash"></i>
                )}
              </span>
              {errors.password && touched.password ? (
                <p className="from-error">{errors.password}</p>
              ) : null}
            </div>

            <div className="mb-3">
              <div className="custom-control custom-checkbox p-0">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customCheck1"
                />
                <div className="d-flex align-items-center justify-content-between">
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />

                  <Link to="/forgotPassword">Forgot Password ?</Link>
                </div>
              </div>
            </div>
            <ToastContainer />

            <p className="d-flex align-items-center justify-content-center">
              Don't have an account yet?{" "}
              <Link to="/register" className="ml-2">
                Register Now
              </Link>
            </p>
            <div className="d-grid">
              <center>
                <button
                  type="submit"
                  className="add-btn"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </center>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
