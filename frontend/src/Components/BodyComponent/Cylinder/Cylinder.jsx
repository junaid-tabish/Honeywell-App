import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { getCylinders, deleteCylinderDetails,replacementRequest, replacementRequestResponse } from "../../../Services/Admin/Cylinder/Controller";
import ConfirmBox from "./confirmationBox";
import { TOSTIFY_TIME } from "../../../Utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import BreadCrum from "../../CommonComponent/BreadCrum/BreadCrum";
import Search from "../../CommonComponent/SearchBar/Search";
import PaginationModule from "../../CommonComponent/Pagination/PaginationModule";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Tooltip } from "@mui/material";
import { Sortmenu } from "../ContractorDetails/Sortmenu";
import { getCylindersDistributor } from "../../../Services/Distributor/Controller";
import { getCylindersContractor } from "../../../Services/Contractor/Controller";
import { USER_ADMIN, USER_CONTRACTOR, USER_DISTRIBUTOR } from "../../../Utils/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faXmark } from "@fortawesome/free-solid-svg-icons";
import "./table.css";

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

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};
const SORT_COLUMNS = [
  {
    header: "Cylinder Id",
    value: "cylinderId",
    id: "cylinderId",
  },
  
];
const COLUMNS = [
  {
    header: "Batch Name",
    value: "batchName",
    id: "batchName",
  },
  {
    header: "Filled Status",
    value: "filledStatus",
    id: "filledStatus",
  },
  {
    header: "Replacement Request",
    value: "replcementRequest",
    id: "replacementRequest",
  },
  {
    header: "Status",
    value: "status",
    id: "status",
  },
]

export default function ContractorList() {
  const [queryParams, setQueryParams] = useState({
    search: "",
    sort: "createdAt",
    order: "desc",
    limit: 10,
    page: 1,
  });
  const { search, order, page } = queryParams;
  const [activeFilterColumn, setActiveFilterColumn] = useState("");
  const [tablePageData, setTablePageData] = useState({
    currentPage: 1,
    lastPage: 1,
    limit: 10,
    nextPage: 1,
    totalRecords: 1,
  });
  
  
  
  const [cylinderData, setCylinderData] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [confirmPromt, setConfirmPrompt] = useState(false);
  const [deleteCylinderId, setDeleteCylinderId] = useState("");
  const [cylinder, setCylinder]=useState();
  const history = useHistory();
  const role = localStorage.getItem('role')
  
 
  const onChangeSearch = (value) => {
    setQueryParams({ ...queryParams, search: value });
  };

  const onClickPageNumber = (value) => {
    setQueryParams({ ...queryParams, page: value });
  };

  const onChangeSortAndOrder = (sortBy, orderBy) => {
    setQueryParams({ ...queryParams, sort: sortBy, order: orderBy });
    setActiveFilterColumn(sortBy);
  };

  const getDeteleteCylinderId = (id) => {
    setConfirmPrompt(true);
    setDeleteCylinderId(id);
  };

  const closeDeleteConfirmation = () => {
    setConfirmPrompt(false);
    setDeleteCylinderId("");
  };
  const deleteCylinder = async () => {
    const response = await deleteCylinderDetails(deleteCylinderId);
    if (response.data.status === 1) {
      toast.success(response.data.message);
      setTimeout(() => {
        history.push(`/${localStorage.getItem("role").toLowerCase()}/cylinder`);
        setConfirmPrompt(false);
        setDeleteCylinderId("");
        fetchCylinderDetails();
      }, TOSTIFY_TIME);
    } else if (response.data.status === 0) {
      let message = "";
      if (typeof response.data.data === "string") {
        message = response.data.message;
      } else {
        message = response.data.data.errors[0].msg;
      }
      toast.error(message);
    }
  };

  //breadcrumbs

  const breadcrumbs = [
    { title: "Dashboard", link: `/${localStorage.getItem("role").toLowerCase()}/dashboard`, active: 0 },
    { title: "Cylinder", link: `/${localStorage.getItem("role").toLowerCase()}/cylinder`, active: 1 },
  ];

  const ToNextPage = (id) => {
    var breadCrum = breadcrumbs.map((el) => {
      el.active = 0;
      return el;
    });
    breadCrum = [
      ...breadCrum,
      {
        title:'Update Cylinder',
        active: 1,
      },
    ];
    history.push({
      pathname: `/${localStorage.getItem("role").toLowerCase()}/cylinder/edit/${id}`,
      state: { id, breadCrum },
    });
  };


  const handleClick = (e) => {
    var breadCrum = breadcrumbs.map((el) => {
      el.active = 0;
      return el;
    });
    breadCrum = [...breadCrum, { title: "Add Cylinder", link:`/${localStorage.getItem("role").toLowerCase()}/cylinder/add`, active: 1 }];
    history.push({ pathname: `/${localStorage.getItem("role").toLowerCase()}/cylinder/add`, state: breadCrum });
  };

const handleRequest=async(row)=>{
  const res= await replacementRequest(row)
  console.log(res.data.status)
  if (Number(res.data.status) === 1) {
    toast.success(res.data.message);
    setTimeout(() => {
      history.push(`/${localStorage.getItem("role").toLowerCase()}/cylinder`);
    }, TOSTIFY_TIME);
    fetchCylinderDetails();
  } else {
    toast.error(res.data.message);
  }
}
const requestConfirmation=(data)=>{
  setConfirmPrompt(true);
  setCylinder(data);
}
const handleRequestResponse=async()=>{
  setConfirmPrompt(false);
  const res=await replacementRequestResponse(cylinder)
  if (Number(res.data.status) === 1) {
    toast.success(res.data.message);
    setTimeout(() => {
      history.push(`/${localStorage.getItem("role").toLowerCase()}/cylinder`);
    }, TOSTIFY_TIME);
    fetchCylinderDetails();
  } else {
    toast.error(res.data.message);
  }
}

  const fetchCylinderDetails = useCallback(async () => {
    setApiStatus(apiStatusConstants.inProgress);
    let response = '';
    if(role === USER_ADMIN){
      response = await getCylinders(queryParams);
    }
    if(role === USER_DISTRIBUTOR){
      response = await getCylindersDistributor(queryParams)
    }
    if(role === USER_CONTRACTOR){
      response = await getCylindersContractor(queryParams)
    }
    
    if (response.data.status === 1) {
      setApiStatus(apiStatusConstants.success);
      setCylinderData(response.data.data.cylindersData);
      setTablePageData({
        currentPage: response.data.data.currentPage,
        lastPage: response.data.data.lastPage,
        limit: response.data.data.limit,
        nextPage: response.data.data.nextPage,
        totalRecords: response.data.data.totalRecords,
      });
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  },[queryParams]);

  function buttonLoader(row){
 switch (row.replacementRequest) {
    case 0:
    return <Button variant="contained" onClick={()=>handleRequest(row)} size="small"  color="primary">
    Send Request</Button>
    case 1:
      return <Button variant="contained" onClick={()=>handleRequest(row)} size="small"  color="primary" disabled>
    Pending..</Button>
    case 2:
      return <Button variant="contained" onClick={()=>handleRequest(row)} size="small"  color="primary">
      Send Request</Button>
    case 3:
    return <><span style={{color:"red",marginRight:5}}>rejected |</span><Button variant="contained" onClick={()=>handleRequest(row)} size="small"  color="primary">
    Send Again</Button></>

  default:
    return console.log(row.replacementRequest)
  }}
  useEffect(() => {
    fetchCylinderDetails();
  }, [fetchCylinderDetails]);


  const showCylinderSuccessView = () => {
    return (
      <div>
        <ToastContainer />
        <ConfirmBox open={confirmPromt} id={deleteCylinderId} closeDialog={closeDeleteConfirmation} deleteFunction={role === 'Admin'?deleteCylinder:handleRequestResponse} />
        <h3>Cylinders</h3>
        {breadcrumbs && <BreadCrum breadcrumbs={breadcrumbs} />}
        <div className="d-flex align-item-center justify-content-between my-4">
          {role === 'Admin' && <button
            type="button"
            className="btn"
            style={{ backgroundColor: "#3f51b5", color: "white" }}
            onClick={() => {
              handleClick();
            }}
          >
            Add{" "}
          </button>}
          
          <div className="d-flex flex-row justify-content-center ml-auto">
            <Search setSearch={onChangeSearch} />
          </div>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                {SORT_COLUMNS.map((each) => {
                  return (
                    <StyledTableCell align="center" key={each.id}>
                      <Sortmenu header={each.header} value={each.value} changeSortAndOrder={onChangeSortAndOrder} activeColumn={activeFilterColumn} columnOrder={order} />
                    </StyledTableCell>
                  );
                })}
                {COLUMNS.map(each => {
                  if (role==='Admin'&&each.header=='Replacement Request'){
                    return null
                  }
                  return <StyledTableCell align="center" key={each.id}>{each.header}</StyledTableCell>
                })}
                {role === 'Admin' && <StyledTableCell align="center" sx={{ minWidth: "200px" }}>
                  Actions
                </StyledTableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {cylinderData.length !== 0 ? (
                cylinderData.map((row) => (
                  <StyledTableRow key={row._id}>
                    <StyledTableCell align="center">{row.cylinderId}</StyledTableCell>
                    <StyledTableCell align="center">{row.batchName}</StyledTableCell>
                    <StyledTableCell align="center">{row.filledStatus}</StyledTableCell>
                    {role==='Distributor'&&
                    <StyledTableCell align="center">
                    <Tooltip title="Accept" placement="top" arrow>
                    <Button style={{marginRight:5}}  variant="contained" onClick={()=>requestConfirmation({...row,replacementRequest:2})} size="small"  color="success" disabled={row.replacementRequest=='1'?false:true}>
                    <i class="fa fa-check" style={{ cursor: "pointer" }}  />
                    </Button>
                    </Tooltip>
                    <span>|</span>
                    <Tooltip title="Reject" placement="top" arrow>
                    <Button style={{marginLeft:5}} variant="contained" onClick={()=>requestConfirmation({...row,replacementRequest:3})} size="small"  color="error" disabled={row.replacementRequest==1?false:true}>
                    <FontAwesomeIcon icon={faXmark} />
                    </Button>
                    </Tooltip>
                   </StyledTableCell>}

                    {role === 'Contractor' &&
                    <StyledTableCell align="center">{buttonLoader(row)}</StyledTableCell>}
                    <StyledTableCell align="center">{row.status}</StyledTableCell>
                    
                    {role === 'Admin' && 
                    <StyledTableCell align="center">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <Tooltip title="edit" placement="top" arrow>
                        <div>
                          <i class="fa fa-edit" onClick={() => ToNextPage(row._id)} style={{ cursor: "pointer" }} />
                        </div>
                        </Tooltip>
                        <Tooltip title="delete" placement="top" arrow>
                        <div>
                        <i class="fa fa-trash" style={{ cursor: "pointer" }} onClick={() => getDeteleteCylinderId(row._id)} title='delete' />
                        </div>
                        </Tooltip>
                      </div>
                    </StyledTableCell>}
                  </StyledTableRow>
                ))
              ) : (
                <>
                  <StyledTableCell align="center" colSpan={8}>
                    No Data Found
                  </StyledTableCell>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="mt-2 d-flex flex-row justify-content-end">
          
          <PaginationModule page={page} count={tablePageData.lastPage} setPage={onClickPageNumber} />
        </div>
      </div>
    );
  };

  const renderCylinderData = () => {
    switch ('SUCCESS') {
      case apiStatusConstants.success:
        return showCylinderSuccessView();
      case apiStatusConstants.inProgress:
        return <h3>Loading...</h3>;
      case apiStatusConstants.failure:
        return <h3>Something Went Wrong...</h3>;
      default:
        return <p>null</p>;
    }
  };

  return renderCylinderData();
}