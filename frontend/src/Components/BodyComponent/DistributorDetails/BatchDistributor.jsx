import React from 'react'
import { Link } from "react-router-dom";
import { getDistributorById, batchesToBeAlloted, updateDistributorsBatch } from '../../../Services/Admin/Distributor/Controller';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast, ToastContainer } from "react-toastify";
import { TOSTIFY_TIME } from '../../../Utils/Constants.js';
import { useHistory } from 'react-router-dom';
import { CardContent, Card } from '@mui/material';
import BreadCrum from '../../CommonComponent/BreadCrum/BreadCrum.js';

export default function BatchDistributor() {

    const breadcrumbs = [
        { title: 'Dashboard', link: '/admin/dashboard', active: 0 },
        { title: 'Distributor', link: '/admin/distributor', active: 0 },
        { title: 'Batch Allocation', link: '/admin/distributor/Batch', active: 1 },
    ];
    const [batches, setBatches] = useState([]);
    const [updatedBatches, setUpdatedBatches] = useState([]);
    const [details, setDetails] = useState([]);

    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        getAllBatches();
        getDistributorDetails();
    }, []);

    const getAllBatches = async () => {
        const res = await batchesToBeAlloted(id)
        setBatches(res.data.data);
        console.log(res)
    }
    const getDistributorDetails = async () => {
        const res = await getDistributorById(id)
        setDetails(res.data.data);
    }

    const allbatches = batches.map(getbatchname)

    function getbatchname(batches) {
        return { value: batches._id, label: batches.batchName }
    }
    
    const handleChange = (selectedOption) => {
        setUpdatedBatches(selectedOption);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalBatches = updatedBatches.map(getbatchname)
        function getbatchname(updatedBatches) {
            return updatedBatches.value
        }
        const res = await updateDistributorsBatch(id, finalBatches)

        if (Number(res.data.status) === 1) {
            toast.success(res.data.message);
            setTimeout(() => {
                history.push(`/admin/distributor/managebatch/${id}`);
            }, TOSTIFY_TIME);
        }
        else {
            toast.error(res.data.message);
        }
    }

    return (
        <>
            <h3>Assign Batches</h3>
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
                            <div><h4>Distributor Details:</h4></div>
                            <div className='p-3'>
                                <label> Name: {details.name}</label>
                            </div>
                            <ToastContainer />
                            <div className="d-grid">
                                <center>
                                    {" "}
                                    <div>
                                        <Select styles={{ width: 50 }} options={allbatches} onChange={handleChange} isMulti />
                                    </div>
                                    <div className='p-5'>
                                        <button type="submit" onClick={handleSubmit} className="btn btn-primary " >
                                            Assign
                                        </button>
                                        <Link to='/admin/distributor/'>
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
