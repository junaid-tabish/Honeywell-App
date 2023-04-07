import { Card, CardContent } from "@material-ui/core";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { getDistributorById, updateDistributor } from "../../../Services/Admin/Distributor/Controller";
import { TOSTIFY_TIME, USER_DISTRIBUTOR } from "../../../Utils/Constants";
import { Distributor } from "../../../Validations/ValidationRules";
import BreadCrum from "../../CommonComponent/BreadCrum/BreadCrum";

export default function UpdateDistributor() {
  const [initialValues, setInitialValues] = useState({
    email: "",
    name: "",
    role: USER_DISTRIBUTOR,
    password: "",
    status: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const handlePassword = (event) => {
    event.stopPropagation();
    setShowPassword(!showPassword);
  };
  const [id, setId] = useState("");

  const { values, errors, touched, handleBlur, handleChange, setValues } = useFormik({
    initialValues,
    validationSchema: Distributor,
    onSubmit: (values, action) => {
      action.resetForm();
    },
  });
  const history = useHistory();

  // useEffect(() => {
  //    setId(Query.get("id"));
  //       getDistributorById(Query.get("id")).then((res)=>{
  //         if (Number(res.data.status) === 1) {
  //           setValues({
  //             email: res.data.data.email,
  //             name: res.data.data.name,
  //             role: res.data.data.role,
  //             password: res.data.data.password,
  //           });
  //         }
  //     })

  // }, [id]);
  const location = useLocation();
  const params = useParams();
  const distrId = params.id;

  useEffect(() => {
    setValues(location.state.row);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await updateDistributor(distrId, values);

    if (Number(res.data.status) === 1) {
      toast.success(res.data.message);
      setTimeout(() => {
        history.push("/admin/distributor");
      }, TOSTIFY_TIME);
    } else {
      toast.error(res.data.message);
    }
  };
  const [breadcumData, setbreadcumData] = useState(location.state.breadCrum);

  return (
    <>
    <h3>Update Distributor</h3>
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
                <div>
                  <label> Name</label>
                  <input type="text" name="name" id="name" className="form-control" placeholder="Name" value={values.name} onChange={handleChange} onBlur={handleBlur} />

                  <p className="from-error">{errors.name && touched.name ? errors.name : null}</p>
                </div>

                <div>
                  <label>Email address</label>
                  <input type="email" name="email" id="email" className="form-control" placeholder="Enter email" value={values.email} onChange={handleChange} onBlur={handleBlur} />

                  <p className="from-error">{errors.email && touched.email ? errors.email : null}</p>
                </div>

                <div>
                  <label>Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled
                  />
                  <span onClick={(e) => handlePassword(e)} className="eicon">
                    {showPassword ? <i className="fa fa-eye"></i> : <i className="fa fa-eye-slash"></i>}
                  </span>
                  <p className="from-error">{errors.password && touched.password ? errors.password : null}</p>
                </div>
                {/* 
              <div>
                <label>Select Role</label>
                <select className="form-control" type="text" name="role" id="role" value={values.role} onChange={handleChange} onBlur={handleBlur} required>
                  <option hidden> Select Role</option>
                  <option value="Distributer">Distributor</option>
                  <option value="Contractor">Contractor</option>
                </select>
                <p className="from-error">{errors.role && touched.role ? errors.role : null}</p>
              </div> */}

                <div>
                  <span className="mb-3 mr-1 text-dark" htmlFor="role">
                    Status:{" "}
                  </span>
                  <input type="radio" className="btn-check" name="status" id="active" required checked={values.status === 1 || values.status === '1'} onChange={handleChange} onBlur={handleBlur} value={1} />
                  <label className="btn btn-sm btn-outline-secondary ml-3 mr-3" htmlFor="active">
                    Active
                  </label>
                  <input type="radio" className="btn-check" name="status" id="inactive" required checked={values.status === 0 || values.status === '0'} onChange={handleChange} onBlur={handleBlur} value={0} />
                  <label className="btn btn-sm btn-outline-secondary ml-3 mb-0" htmlFor="inactive">
                    In Active
                  </label>
                </div>

                <ToastContainer />

                <br />

                <div className="d-grid">
                  <center>
                    <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                      Submit
                    </button>
                    <Link to="/admin/distributor">
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
