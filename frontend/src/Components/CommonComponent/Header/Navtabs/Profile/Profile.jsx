import React, { useEffect, useState } from "react";
import { getProfile } from "../../../../../Services/Profile/Controller";
import BreadCrum from "../../../BreadCrum/BreadCrum";
import "./Profile.css";
import jwt_decode from "jwt-decode";
import {useHistory} from "react-router";
import {Link} from "react-router-dom";

const initialValues = {
  email: "",
  status:"",
  name: "",
  role: "",
};

function Profile() {
  const [profile, setProfile] = useState(initialValues);
  const history=useHistory()

  useEffect(() => {
    (async () => {
        try{
            
                let token = localStorage.getItem("token");
                let decode = jwt_decode(token);
                let parameter={
                    path:window.location.pathname.split("/")[1],
                    id:decode.userID
                }
                const res = await getProfile(parameter);
                if(res.data.status===1){
                    setProfile(
                        {
                            email: res.data.data.email,
                            status: res.data.data.status,
                            name: res.data.data.name,
                            role: res.data.data.role,
                        }
                    )
                }
              
        }
        catch(e){
            // localStorage.clear()
            // history.push("/")        
        }

      
    })();
  }, []);

  const breadcrumbs = [
    { title: "Dashboard", link: `/${localStorage.getItem("role").toLowerCase()}/dashboard`, active: 0 },
    { title: "Profile", link: `/${localStorage.getItem("role").toLowerCase()}/profile`, active: 1 },
  ];

  return (
    <>
      <h3>Profile</h3>

      {breadcrumbs && <BreadCrum breadcrumbs={breadcrumbs} />}

     
      
        <div class="col-xl-12 col-md-12">
          <div class="card user-card-full">
            <div class="row m-l-0 m-r-0">
              <div class="col-sm-4 bg-c-lite-green user-profile">
                <div class="card-block text-center text-white">
                  <div class="m-b-25" style={{ height: "50px" }}>
                    <img
                      src="https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331257__340.png"
                      style={{ borderRadius: "50%", width: "300px" }}
                    />
                  </div>
                  {/* <h6 class="f-w-600">Name</h6>
                                                                <p>Role</p> */}
                  <i class=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                </div>
              </div>
              <div class="col-sm-8">
                <div class="card-block">
                  <h2 class="m-b-20 p-b-5 b-b-default f-w-600">Information</h2>
                  <div class="row">
                    <div class="col-sm-6">
                      <p class="m-b-10 f-w-600">Name</p>
                      <h6 class="text-muted f-w-400">{profile.name}</h6>
                    </div>
                    <div class="col-sm-6">
                      <p class="m-b-10 f-w-600">Email</p>
                      <h6 class="text-muted f-w-400">{profile.email}</h6>
                    </div>
                  </div>
                  <h6 class="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">.</h6>
                  <div class="row">
                    <div class="col-sm-6">
                      <p class="m-b-10 f-w-600">Role</p>
                      <h6 class="text-muted f-w-400">{profile.role}</h6>
                    </div>
                    <div class="col-sm-6">
                      <p class="m-b-10 f-w-600">Status</p>
                      <h6 class="text-muted f-w-400">{profile.status===1?"Active":"Inactive"}</h6>
                    </div>
                    <div className="col-sm-12 d-flex  justify-content-end">
                    <Link to={`/${localStorage.getItem("role").toLowerCase()}/dashboard`}>
                      <button className="btn btn-primary ml-4 ">Back</button>
                    </Link>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
    </>
  );
}

export default Profile;
