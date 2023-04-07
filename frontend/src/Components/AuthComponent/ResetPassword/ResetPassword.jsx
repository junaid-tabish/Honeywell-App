import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useParams } from "react-router";
import { TOSTIFY_TIME } from "../../../Utils/Constants";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";

export default function ResetPass() {
  const { id, token } = useParams();
  console.log(id, token);

  const history = useHistory();

  const [password, setPassword] = useState("");
  const [conPass, setConpass] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password && conPass) {
      if (password !== conPass) {
        toast.error("New Password and Confirm New Password doesn't match!");
      } else {
        var data = {
          password: password,
          passwordConfirmation: conPass,
        };
        await axios
          .post(
            `http://localhost:8000/api/auth/reset-password/${id}/${token}`,
            data
          )
          .then((res) => {
            if (res.data.status === 1) {
              toast.success(res.data.message);
              setTimeout(() => {
                history.push("/");
              }, TOSTIFY_TIME);
            } else {
              toast.error(res.data.message);
            }
          });
      }
    }
  };
  return (
    <form onSubmit={handleSubmit} className="forget-password">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div className="card text-center border-0" style={{ width: "500px" }}>
          <h5
            className="m-0 text-white text-uppercase py-2"
            style={{ backgroundColor: "rgb(63, 81, 181)" }}
          >
            Password Reset
          </h5>
          <div className="card-body px-5 my-2">
            <div className="">
              <label className="d-flex mb-1" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                id="password"
                placeholder="Enter your password"
                className="form-control my-3"
              />
            </div>
            <div className="form-outline mb-4">
              <label className="d-flex mb-1" htmlFor="password">
                Confirm Password
              </label>
              <input
                type="password"
                name="passwordConfirmation"
                onChange={(event) => setConpass(event.target.value)}
                value={conPass}
                id="passwordConfirmation"
                placeholder="Confirm Password"
                className="form-control my-3"
              />
            </div>
            <button type="submit" className="add-btn ">
              Reset password
            </button>
            {/* <a href="#" className="btn btn-primary w-100">Reset password</a> */}
            <div className="d-flex justify-content-between mt-4">
              <Link to="/">Login</Link>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
