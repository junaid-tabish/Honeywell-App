import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { ToastContainer } from "react-toastify";
import { CardContent, Card, Grid } from '@mui/material';
import { getActiveContractors, getActiveCylinders, getActiveDistributors, getActiveSites, getCylinders } from '../../../Services/Admin/AssetTracking/Controller';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import BreadCrum from '../../CommonComponent/BreadCrum/BreadCrum.js';
import { FILLEDSTATUS, STATUS, USER_ADMIN, USER_CONTRACTOR, USER_DISTRIBUTOR } from '../../../Utils/Constants';
import PaginationModule from '../../CommonComponent/Pagination/PaginationModule';
import Paper from '@mui/material/Paper';
import jwtDecode from 'jwt-decode';


export default function AssetTracking() {
  // const selectRef = useRef(null);
  const breadcrumbs = [
    { title: 'Dashboard', link: '/admin/dashboard', active: 0 },
    { title: 'Asset Tracking', link: '/admin/AssetTracking', active: 1 },
  ];
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#3f51b5",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const [distributor, setDistributor] = useState([]);
  const [contractor, setContractor] = useState([]);
  const [site, setSite] = useState([]);
  const [search, setSearch] = useState([]);
  const [page, setPage] = useState(1);
  const [pdata, setPdata] = useState([]);
  const [ids, setIds] = useState({
    distId: { label: "", value: "" },
    contId: { label: "", value: "" },
    siteId: { label: "", value: "" }
  });


  useEffect(() => {


    const token = localStorage.getItem('token');
    var decoded = jwtDecode(token);
    console.log("token", decoded);
    if (decoded.userRole == USER_DISTRIBUTOR) {

      getActiveContractors(decoded.userID)
        .then((res) => {
          setContractor(res.data.data.map(contractor => {
            return { value: contractor._id, label: contractor.name };
          }));
        });

    }
    else if (decoded.userRole == USER_CONTRACTOR) {

      getActiveSites(decoded.userID)
        .then((res) => {
          setSite(res.data.data.map(site => {
            return { value: site._id, label: site.siteName };
          }));
        });

    }
    else if (decoded.userRole == USER_ADMIN) {
      if (!distributor.length)
        getActiveDistributors()
          .then((res) => {
            setDistributor(res.data.data.map(distributor => {
              return { value: distributor._id, label: distributor.name };
            }));
          });
    }


    getActiveCylinders()
      .then((res) => {
        setPdata(res.data.data)
        setSearch(res.data.data);

      })
  }, [])



  const handleDistributor = (selectedOption) => {
    setIds({ ...ids, distId: selectedOption })
    getActiveContractors(selectedOption.value)
      .then((res) => {
        setContractor(res.data.data.map(contractor => {
          return { value: contractor._id, label: contractor.name };
        }));
      });
  }

  const handleContractor = (selectedOption) => {
    setIds({ ...ids, contId: selectedOption });
    getActiveSites(selectedOption.value)
      .then((res) => {
        setSite(res.data.data.map(site => {
          return { value: site._id, label: site.siteName };
        }));
      });


  }

  const handleSite = (selectedOption) => {
    setIds({ ...ids, siteId: selectedOption });
  }



  const Search = () => {
    getCylinders(ids.distId.value, ids.contId.value, ids.siteId.value)
      .then((res) => {
        setSearch(res.data.data);
      })

  }

  const handleReset = (e) => {
    e.preventDefault();
    setContractor([])
    setSite([])
    setIds({
      distId: {},
      contId: {},
      siteId: {}
    });
    setSearch(pdata);
    setPage(1);

  }

  const [role, setRole] = useState(localStorage.getItem("role"));

  return (

    <>
      <h3>Asset Tracking</h3>
      <div>

        {breadcrumbs && <BreadCrum breadcrumbs={breadcrumbs} />}
        {role === USER_ADMIN && (
          <div className="adminDiv">
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
                    <div className='p-3'>
                    </div>
                    <ToastContainer />
                    <div className="form-content form-container">
                      <div className="d-grid">

                        <div >
                          <Grid container className="mt-3 ">
                            <Grid item lg={0.8}></Grid>
                            <Grid item lg={3.2} >

                              <h6 > Select Distributor :</h6>
                              <Select options={distributor} value={ids.distId} onChange={handleDistributor} maxMenuHeight={120} />
                            </Grid>
                            <Grid item lg={0.8}></Grid>
                            <Grid item lg={3.2}>
                              <h6 >Select Contractor :</h6>
                              <Select options={contractor} value={ids.contId} onChange={handleContractor} maxMenuHeight={120} />
                            </Grid>
                            <Grid item lg={0.8}></Grid>
                            <Grid item lg={3.2}>
                              <h6 > Select Site :</h6>
                              <Select options={site} value={ids.siteId} onChange={handleSite} maxMenuHeight={120} />
                            </Grid>
                          </Grid>
                        </div>

                        <div className="form-button mt-3 px-3 d-flex align-item-center justify-content-center p-3">
                          <button type="button" className="btn btn-primary " onClick={Search} >
                            Search
                          </button>

                          <button className="btn btn-primary ml-4" onClick={handleReset}>Reset</button>

                        </div>

                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div>
              <ToastContainer />
              <TableContainer component={Paper} >
                <Table sx={{ minWidth: 700 }} aria-label="customized table" >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Site Name</StyledTableCell>
                      <StyledTableCell align="center">CylinderId</StyledTableCell>
                      <StyledTableCell align="center">Filled Status</StyledTableCell>
                      <StyledTableCell align="center">Replacement Request</StyledTableCell>
                      <StyledTableCell align="center">Status</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {search.length !== 0 ? (
                      search.map((row, i) => (
                        <>
                          <StyledTableRow key={i} >
                            <StyledTableCell align="center">{row.siteName}</StyledTableCell>
                            <StyledTableCell align="center">{row.cylinders ? row.cylinders.cylinderId: '-' }</StyledTableCell>
                            <StyledTableCell align="center">{row.cylinders ?FILLEDSTATUS[row.cylinders.filledStatus]: '-'}</StyledTableCell>
                            <StyledTableCell align="center">{row.cylinders ?(row.cylinders.replacementRequest ? "Yes" : "No"): '-'}</StyledTableCell>
                            <StyledTableCell align="center">{row.cylinders ?STATUS[row.cylinders.status]: '-'}</StyledTableCell>
                          </StyledTableRow>
                        </>
                      ))
                    ) : (<>
                      <StyledTableCell align="center" colSpan={7}>
                        No Data Found
                      </StyledTableCell>
                    </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className='mt-2 pull-right'>
                <PaginationModule page={page} count={Math.ceil(5 / 5)} setPage={(page) => setPage(page)} />
              </div>
            </div>

          </div>
        )}
        {/* distributor */}
        {role === USER_DISTRIBUTOR && (
          <div className="adminDiv">
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
                    <div className='p-3'>
                    </div>
                    <ToastContainer />
                    <div className="form-content form-container">
                      <div className="d-grid">


                        <div >
                          <Grid container className="mt-3 ">

                            <Grid item lg={1.9}></Grid>
                            <Grid item lg={3.2}>
                              <h6 >Select Contractor :</h6>
                              <Select options={contractor} value={ids.contId} onChange={handleContractor} maxMenuHeight={120} />
                            </Grid>
                            <Grid item lg={1.8}></Grid>
                            <Grid item lg={3.2}>
                              <h6 > Select Site :</h6>
                              <Select options={site} value={ids.siteId} onChange={handleSite} maxMenuHeight={120} />
                            </Grid>
                          </Grid>
                        </div>

                        <div className="form-button mt-3 px-3 d-flex align-item-center justify-content-center p-3">
                          <button type="button" className="btn btn-primary " onClick={Search} >
                            Search
                          </button>

                          <button className="btn btn-primary ml-4" onClick={handleReset}>Reset</button>

                        </div>

                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div>
              <ToastContainer />
              <TableContainer component={Paper} >
                <Table sx={{ minWidth: 700 }} aria-label="customized table" >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Site Name</StyledTableCell>
                      <StyledTableCell align="center">CylinderId</StyledTableCell>
                      <StyledTableCell align="center">Filled Status</StyledTableCell>
                      <StyledTableCell align="center">Replacement Request</StyledTableCell>
                      <StyledTableCell align="center">Status</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {search.length !== 0 ? (
                      search.map((row, i) => (
                        <>
                          <StyledTableRow key={i} >
                            <StyledTableCell align="center">{row.siteName}</StyledTableCell>
                            <StyledTableCell align="center">{row.cylinders.cylinderId}</StyledTableCell>
                            <StyledTableCell align="center">{FILLEDSTATUS[row.cylinders.filledStatus]}</StyledTableCell>
                            <StyledTableCell align="center">{row.cylinders.replacementRequest ? "Yes" : "No"}</StyledTableCell>
                            <StyledTableCell align="center">{STATUS[row.cylinders.status]}</StyledTableCell>
                          </StyledTableRow>
                        </>
                      ))
                    ) : (<>
                      <StyledTableCell align="center" colSpan={7}>
                        No Data Found
                      </StyledTableCell>
                    </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className='mt-2 pull-right'>
                <PaginationModule page={page} count={Math.ceil(5 / 5)} setPage={(page) => setPage(page)} />
              </div>
            </div>

          </div>
        )}

        {/* contractor */}

        {role === USER_CONTRACTOR && (
          <div className="adminDiv">
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
                    <div className='p-3'>
                    </div>
                    <ToastContainer />
                    <div className="form-content form-container">
                      <div className="d-grid">

                        <div >
                          <Grid container className="mt-3 ">

                            <Grid item lg={4.5}></Grid>
                            <Grid item lg={3.2}>
                              <h6 > Select Site :</h6>
                              <Select options={site} value={ids.siteId} onChange={handleSite} maxMenuHeight={120} />
                            </Grid>
                          </Grid>
                        </div>

                        <div className="form-button mt-3 px-3 d-flex align-item-center justify-content-center p-3">
                          <button type="button" className="btn btn-primary " onClick={Search} >
                            Search
                          </button>

                          <button className="btn btn-primary ml-4" onClick={handleReset}>Reset</button>

                        </div>
                        {/* </center> */}
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div>
              <ToastContainer />
              <TableContainer component={Paper} >
                <Table sx={{ minWidth: 700 }} aria-label="customized table" >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Site Name</StyledTableCell>
                      <StyledTableCell align="center">CylinderId</StyledTableCell>
                      <StyledTableCell align="center">Filled Status</StyledTableCell>
                      <StyledTableCell align="center">Replacement Request</StyledTableCell>
                      <StyledTableCell align="center">Status</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {search.length !== 0 ? (
                      search.map((row, i) => (
                        <>
                          <StyledTableRow key={i} >
                            <StyledTableCell align="center">{row.siteName}</StyledTableCell>
                            <StyledTableCell align="center">{row.cylinders.cylinderId}</StyledTableCell>
                            <StyledTableCell align="center">{FILLEDSTATUS[row.cylinders.filledStatus]}</StyledTableCell>
                            <StyledTableCell align="center">{row.cylinders.replacementRequest ? "Yes" : "No"}</StyledTableCell>
                            <StyledTableCell align="center">{STATUS[row.cylinders.status]}</StyledTableCell>
                          </StyledTableRow>
                        </>
                      ))
                    ) : (<>
                      <StyledTableCell align="center" colSpan={7}>
                        No Data Found
                      </StyledTableCell>
                    </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className='mt-2 pull-right'>
                <PaginationModule page={page} count={Math.ceil(5 / 5)} setPage={(page) => setPage(page)} />
              </div>
            </div>

          </div>
        )}
      </div>

    </>

  )
}