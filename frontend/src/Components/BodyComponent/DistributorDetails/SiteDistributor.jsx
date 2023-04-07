import React from 'react'
import { Link } from "react-router-dom";
import { getDistributorById, sitesToBeAlloted, updateDistributorsSite } from '../../../Services/Admin/Distributor/Controller';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast, ToastContainer } from "react-toastify";
import { TOSTIFY_TIME } from '../../../Utils/Constants.js';
import { useHistory } from 'react-router-dom';
import { CardContent, Card } from '@mui/material';
import BreadCrum from '../../CommonComponent/BreadCrum/BreadCrum.js';




export default function SiteDistributor() {

    const breadcrumbs = [
        { title: 'Dashboard', link: '/admin/dashboard', active: 0 },
        { title: 'Distributor', link: '/admin/distributor', active: 0 },
        { title: 'Site Allocation', link: '/admin/distributor/Site', active: 1 },
    ];
    const [sites, setSites] = useState([]);
    const [updatedSites, setUpdatedSites] = useState([]);
    const [details, setDetails] = useState([]);

    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        getAllSites();
        getDistributorDetails();
    }, []);

    const getAllSites = async () => {
        const res = await sitesToBeAlloted(id)
        setSites(res.data.data);
        console.log(res)
    }
    const getDistributorDetails = async () => {
        const res = await getDistributorById(id)
        setDetails(res.data.data);
    }

    const allsites = sites.map(getsitename)
    function getsitename(sites) {
        return { value: sites._id, label: sites.siteName }
    }

    const handleChange = (selectedOption) => {
        setUpdatedSites(selectedOption);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalSites = updatedSites.map(getsitename)
        function getsitename(updateSites) {
            return updateSites.value
        }
        
        const res = await updateDistributorsSite(id, finalSites)

        if (Number(res.data.status) === 1) {
            toast.success(res.data.message);
            setTimeout(() => {
                history.push(`/${localStorage.getItem("role").toLowerCase()}/distributor/managesite/${id}`);
            }, TOSTIFY_TIME);
        }
        else {
            toast.error(res.data.message);
        }
    }

    return (
        <>

            <h3>Assign Sites</h3>

            {breadcrumbs && <BreadCrum breadcrumbs={breadcrumbs} />}

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
                            <div><h4>Contractor Details:</h4></div>
                            <div className='p-3'>
                                <label> Name: {details.name}</label>
                            </div>
                            <ToastContainer />
                            <div className="d-grid">
                                <center>
                                    {" "}
                                    <div>
                                        <Select styles={{ width: 50 }} options={allsites} onChange={handleChange} isMulti />
                                    </div>
                                    <div className='p-5'>
                                        <button type="submit" onClick={handleSubmit} className="btn btn-primary " >
                                            Assign
                                        </button>
                                        <Link to={`/${localStorage.getItem("role").toLowerCase()}/distributor`}>
                                            <button className="btn btn-primary ml-4">Cancel</button>
                                        </Link>
                                    </div>
                                </center>

                            </div>
                        </form>
                    </CardContent>
                </Card>


            </div>
        </>
    )
}
