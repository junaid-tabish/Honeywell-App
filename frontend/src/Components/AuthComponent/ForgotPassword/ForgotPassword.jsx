import axios from "axios";
import React from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { TOSTIFY_TIME } from "../../../Utils/Constants";
import "./forgotPassword.css";
import "../../../Utils/Constants"

export default function ForgotPass() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    // alert("hiii")
    event.preventDefault();

    await axios
      .post(`${process.env.REACT_APP_API_URL}auth/send-reset-password-email`, {
        email: email,
      })
      .then((res) => {
        if (res.data.status === 1) {
          // history.push("/site");
          toast.success(res.data.message);
          setTimeout(() => {}, TOSTIFY_TIME);
        } else {
          toast.error(res.data.message);
        }
      });
  };
  return (
    <form onSubmit={handleSubmit} className="forget-password ">
      <div className="card text-center forget-password__card">
        <div
          className="card-header h5 text-white text-uppercase"
          style={{ backgroundColor: "#3f51b5" }}
        >
          forget password
        </div>
        <div className="card-body px-5">
          <p className="card-text py-2">
            Enter your email address and we'll send you an email with
            instructions to reset your password.
          </p>
          <div className="form-outline">
            <input
              type="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              id="typeEmail"
              className="form-control my-3"
              placeholder="Enter your email id"
            />
            {/* <label className="form-label" htmlFor="typeEmail">Email input</label> */}
          </div>
          <button type="submit" className="btn add-btn btn-info mt-3">
            Reset password
          </button>
          {/* <a href="#" className="btn btn-primary w-100">Reset password</a> */}
          <div className="forget-password__btn mt-4">
            <Link to="/">Login</Link>
            <Link to="/register">Register</Link>
          </div>
          <ToastContainer />
        </div>
      </div>
    </form>
  );
}
