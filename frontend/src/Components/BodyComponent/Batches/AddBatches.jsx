import React from "react";
import { Link } from "react-router-dom";
import { addBatch } from "../../../Services/Admin/Batches/Controller";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { TOSTIFY_TIME } from "../../../Utils/Constants";
import "react-toastify/dist/ReactToastify.css";
import { batch } from "../../../Validations/ValidationRules";
import { useState } from "react";
import { Card, CardContent } from "@material-ui/core";
import BreadCrum from "../../CommonComponent/BreadCrum/BreadCrum";
import { useLocation } from "react-router-dom";

const initialValues = {
  batchId: "",
  batchName: "",
  status: "",
};

export default function AddBatches() {
  const { values, errors, touched, handleBlur, handleChange } = useFormik({
    initialValues,
    validationSchema: batch,
    onSubmit: (values, action) => {
      action.resetForm();
    },
  });

  const location = useLocation();
  const history = useHistory();
  const [status, setStatus] = useState(1);
  const [breadcumData, setbreadcumData] = useState(location.state);

  const handleOnStatus = (event) => {
    setStatus(parseInt(event.target.value));
    console.log(status);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    values.status = status;
    console.log(values);
    addBatch(values).then((res) => {
      if (Number(res.data.status) === 1) {
        toast.success(res.data.message);
        setTimeout(() => {
          history.push(`/${localStorage.getItem("role").toLowerCase()}/batch`);
        }, TOSTIFY_TIME);
      } else {
        toast.error(res.data.message);
      }
    });
  };

  return (
    <>
      <h3> Add Batches</h3>
      {breadcumData && <BreadCrum breadcrumbs={breadcumData} />}

      <div>
        {console.log(errors)}
        <div>
          <Card
            style={{
              padding: "20px",
              borderRadius: "5px",
            }}
          >
            <CardContent>
              <form>
                <div>
                  <label> Batch Id</label>
                  <input type="number" name="batchId" id="batchId" className="form-control" placeholder="Enter Batch ID" value={values.batchId} onChange={handleChange} onBlur={handleBlur} />

                  <p className="from-error">{errors.batchId && touched.batchId ? errors.batchId : null}</p>
                </div>

                <div>
                  <label>Batch Name</label>
                  <input type="text" name="batchName" id="batchName" className="form-control" placeholder="Enter Batch Name" value={values.batchName} onChange={handleChange} onBlur={handleBlur} />

                  <p className="from-error">{errors.batchName && touched.batchName ? errors.batchName : null}</p>
                </div>

                <div className="col-md-12 mt-3">
                  <span className="mb-3 mr-1 text-dark" htmlFor="status">
                    Status:{" "}
                  </span>
                  Active :&nbsp;
                  <input type="radio" className="btn-check text-dark" name="status" checked={status} onChange={handleOnStatus} value="1" id="active" autoComplete="off" required />
                  &nbsp;&nbsp; InActive :&nbsp;
                  <input type="radio" className="btn-check text-dark" checked={!status} value="0" name="status" id="inActive" autoComplete="off" required onChange={handleOnStatus} />
                </div>

                <ToastContainer />

                <div className="d-grid">
                  <center>
                    {" "}
                    <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                      Submit
                    </button>
                    <Link to={`/${localStorage.getItem("role").toLowerCase()}/batch`}>
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
