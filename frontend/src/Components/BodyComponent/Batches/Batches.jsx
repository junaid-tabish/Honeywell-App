import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TOSTIFY_TIME, STATUS, USER_ADMIN, USER_DISTRIBUTOR } from "../../../Utils/Constants.js";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useHistory} from "react-router-dom";
import { getbatch, deleteBatch, getCount } from "../../../Services/Admin/Batches/Controller";
import ConfirmBox from "../../CommonComponent/ConfirmBox/Confirmbox";
import dateformat from "../../../Utils/Common";
import BreadCrum from "../../CommonComponent/BreadCrum/BreadCrum";
import Search from "../../CommonComponent/SearchBar/Search";
import PaginationModule from "../../CommonComponent/Pagination/PaginationModule";
import { TableSortLabel } from "@material-ui/core";
import "../../CommonComponent/SearchBar/search.css";
import jwtDecode from "jwt-decode";

import {getAllotedBatchesOfDistributors} from "../../../Services/Distributor/Batches/Controller.js";





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
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function Batches() {
  const [batches, setBatches] = useState([]);
  const [page, setPage] = useState(1);
  const [toatalCount, setTotalCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [title, setTitle] = useState("");
  
  const token =  jwtDecode(localStorage.getItem("token"))
        const id = token.userID


  useEffect(() => {
     if (role === USER_ADMIN) {
       getAllBatches();
     } else {
      getDistributorBatch();
     }
     getTotalCount();
   }, [page, search, orderDirection]);
    

  useEffect(()=>{
    console.log(batches)
  },[batches])

  const url = `?page=${page}&search=${search}&sort=${title}&order=${orderDirection}`;

  const breadcrumbs = [
    { title: "Dashboard", link: `/${localStorage.getItem("role").toLowerCase()}/dashboard`, active: 0 },
    { title: "Batches", link: `/${localStorage.getItem("role").toLowerCase()}/batch`, active: 1 },
  ];
  const getDistributorBatch=async()=>{
    const res=await getAllotedBatchesOfDistributors(id,url);
      setBatches(res.data.data)
  }
  const getAllBatches = async () => {
    const response = await getbatch(url);
    setBatches(response.data.data);
  };
  const getTotalCount = async () => {
    const response = await getCount();
    setTotalCount(response.data.data.batchCount);
  };

  function openDelete(data) {
    setOpen(true);
    setDeleteData(data);
  }

  const ToNextPage = (batches) => {
    var breadCrum = breadcrumbs.map((el) => {
      el.active = 0;
      return el;
    });
    breadCrum = [...breadCrum, { title: "Update Batch", link: `/${localStorage.getItem("role").toLowerCase()}/batch/edit/${batches._id}`, active: 1 }];
    history.push({ pathname: `/${localStorage.getItem("role").toLowerCase()}/batch/edit/${batches._id}`, state: { breadCrum } });
  };

  const handleClick = (e) => {
    // e.preventDefault();
    var breadCrum = breadcrumbs.map((el) => {
      el.active = 0;
      return el;
    });
    breadCrum = [...breadCrum, { title: "Add Batches", link: `/${localStorage.getItem("role").toLowerCase()}/batch/add`, active: 1 }];
    history.push({ pathname: `/${localStorage.getItem("role").toLowerCase()}/batch/add`, state: breadCrum });
  };

  function handleSortRequestOnName() {
    setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
    setTitle("batchName");
  }
  function handleSortRequest() {
    setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
    setTitle("createdAt");
  }
  function handleSortRequestOnId() {
    setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
    setTitle("batchId");
  }
  function handleonDelete() {
    setOpen(false);
    deleteBatch(deleteData._id).then((res) => {
      if (Number(res.data.status) === 1) {
        toast.success(res.data.message);
        setTimeout(() => {
          history.push(`/${localStorage.getItem("role").toLowerCase()}/batch`);
        }, TOSTIFY_TIME);
        getAllBatches();
      } else {
        toast.error(res.data.message);
      }
    });
    
  }


  const [role, setRole] = useState(localStorage.getItem("role"));
  return (
    <>
     {role === USER_ADMIN && (
    
    <div className="AdminBatch">
      <div>
        <h3>Batches</h3>
        <div className="w3-metro-darken">{breadcrumbs && <BreadCrum breadcrumbs={breadcrumbs} />}</div>
        <div className="d-flex align-item-center justify-content-between my-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              handleClick();
            }}
          >
            Add{" "}
          </button>
          <div>
            <div>
              <Search setSearch={(search) => setSearch(search)} />
            </div>
          </div>
        </div>

        <ToastContainer />
        

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center" onClick={handleSortRequestOnId}>
                  Batch ID
                  <TableSortLabel align="center" active={title === "batchId" ? true : false} direction={orderDirection}></TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align="center" onClick={handleSortRequestOnName}>
                  Batch Name
                  <TableSortLabel align="center" active={title === "batchName" ? true : false} direction={orderDirection}></TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center" onClick={handleSortRequest}>
                  Created On
                  <TableSortLabel align="center" active={title === "createdAt" ? true : false} direction={orderDirection}></TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {batches.length !== 0 ? (
                batches.map((batches) => (
                  <>
                    <StyledTableRow key={batches.batchId}>
                      <StyledTableCell align="center">{batches.batchId}</StyledTableCell>
                      <StyledTableCell component="th" scope="row" align="center">
                        {batches.batchName}
                      </StyledTableCell>
                      <StyledTableCell align="center">{STATUS[batches.status]}</StyledTableCell>
                      <StyledTableCell align="center">{dateformat(batches.createdAt)}</StyledTableCell>
                      <StyledTableCell align="center">
                        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                          <div>
                            <i class="fa fa-edit" onClick={() => ToNextPage(batches)} style={{ cursor: "pointer" }}  />
                          </div>
                          <div>
                            <button type="button" onClick={() => openDelete(batches)} style={{ cursor: "pointer" }}  className="border-0 bg-transparent">
                              <i className="fa fa-trash icon" />
                            </button>
                          </div>
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  </>
                ))
              ) : (
                <>
                  <StyledTableCell align="center" colSpan={7}>
                    No Data Found
                  </StyledTableCell>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="mt-2 pull-right">
          <PaginationModule page={page} count={Math.ceil(toatalCount / 10)} setPage={(page) => setPage(page)} />
        </div>
     </div>
     
     <ConfirmBox open={open} closeDialog={() => setOpen(false)} deleteFunction={handleonDelete} />
     </div>

)}

{/* /////////////////////////////////////////// Distributor Batches */}

{role === USER_DISTRIBUTOR && (
    
    <div className="AdminBatch">
      <div>
        <h3>Batches</h3>
        <div className="w3-metro-darken">{breadcrumbs && <BreadCrum breadcrumbs={breadcrumbs} />}</div>
        <div className="d-flex align-item-center justify-content-end my-4">
            <div>
              <Search setSearch={(search) => setSearch(search)} />
            </div>
          </div>
       

        <ToastContainer />
        

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center" onClick={handleSortRequestOnId}>
                  Batch ID
                  <TableSortLabel align="center" active={title === "batchId" ? true : false} direction={orderDirection}></TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align="center" onClick={handleSortRequestOnName}>
                  Batch Name
                  <TableSortLabel align="center" active={title === "batchName" ? true : false} direction={orderDirection}></TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center" onClick={handleSortRequest}>
                  Created On
                  <TableSortLabel align="center" active={title === "createdAt" ? true : false} direction={orderDirection}></TableSortLabel>
                </StyledTableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {batches.length !== 0 ? (
                batches.map((batches) => (
                  <>
                    <StyledTableRow key={batches.batchId}>
                      <StyledTableCell align="center">{batches.batchId}</StyledTableCell>
                      <StyledTableCell component="th" scope="row" align="center">
                        {batches.batchName}
                      </StyledTableCell>
                      <StyledTableCell align="center">{STATUS[batches.status]}</StyledTableCell>
                      <StyledTableCell align="center">{dateformat(batches.createdAt)}</StyledTableCell>
                    </StyledTableRow>
                  </>
                ))
              ) : (
                <>
                  <StyledTableCell align="center" colSpan={7}>
                    No Data Found
                  </StyledTableCell>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="mt-2 pull-right">
          <PaginationModule page={page} count={Math.ceil(toatalCount / 10)} setPage={(page) => setPage(page)} />
        </div>
     </div>
     
     <ConfirmBox open={open} closeDialog={() => setOpen(false)} deleteFunction={handleonDelete} />
     </div>

)}
    </>
  );
}