import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect, useCallback } from "react";
import { contractorsDetails, deleteContractor } from "../../../Services/Admin/Contractor/Controller";
import { BiSearch } from "react-icons/bi";
import { Sortmenu } from "./Sortmenu";
import BreadCrum from "../../CommonComponent/BreadCrum/BreadCrum";
import { useHistory } from "react-router-dom";
import ConfirmBox from "../../CommonComponent/ConfirmBox/Confirmbox";
import { toast, ToastContainer } from "react-toastify";
import { TOSTIFY_TIME } from "../../../Utils/Constants";
import PaginationModule from "../../CommonComponent/Pagination/PaginationModule";
import Search from "../../CommonComponent/SearchBar/Search";

import "./contractorsList.css";
import { Button, Tooltip } from "@material-ui/core";
import { Distributor } from "../../../Validations/ValidationRules";
import { contractor } from "../../../Services/Contractor/Controller";

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
  // hide last border
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

const COLUMNS = [
  {
    header: "Contractor Name",
    value: "name",
    id: "name",
  },
  {
    header: "Email Id",
    value: "email",
    id: "email",
  },
];

export default function ContractorList() {
  const [queryParams, setQueryParams] = useState({
    search: "",
    sort: "createdAt",
    order: "desc",
    limit: 10,
    page: 1,
  });
  const { search, order, page } = queryParams;
  const [contractorsData, setContractorsData] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [activeFilterColumn, setActiveFilterColumn] = useState("");
  const [tablePageData, setTablePageData] = useState({
    currentPage: 1,
    lastPage: 1,
    limit: 10,
    nextPage: 1,
    totalRecords: 1,
  });
  //delete record
  const [confirmPromt, setConfirmPrompt] = useState(false);
  const [deleteCylinderId, setDeleteCylinderId] = useState("");
  const getDeteleteCylinderId = (id) => {
    setConfirmPrompt(true);
    setDeleteCylinderId(id);
  };

  const closeDeleteConfirmation = () => {
    setConfirmPrompt(false);
    setDeleteCylinderId("");
  };

  const deleteContractorDetails = async () => {
    const response = await deleteContractor(deleteCylinderId);
    if (response.data.status === 1) {
      toast.success(response.data.message);
      setTimeout(() => {
        history.push(`/${localStorage.getItem("role").toLowerCase()}/contractor`);
        setConfirmPrompt(false);
        setDeleteCylinderId("");
        getContractors();
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

  //***********//

  const history = useHistory();

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

  //****breadcrubs****//
  const breadcrumbs = [
    { title: "Dashboard", link: `/${localStorage.getItem("role").toLowerCase()}/dashboard`, active: 0 },
    { title: "Contractor", link: `/${localStorage.getItem("role").toLowerCase()}/contractor`, active: 1 },
  ];

  const ToNextPage = (row) => {
    var breadCrum = breadcrumbs.map((el) => {
      el.active = 0;
      return el;
    });
    breadCrum = [
      ...breadCrum,
      {
        title: "Update Contractor",
        link: `/${localStorage.getItem("role").toLowerCase()}/contractor/edit/${row._id}`,
        active: 1,
      },
    ];
    history.push({
      pathname: `/${localStorage.getItem("role").toLowerCase()}/contractor/edit/${row._id}`,
      state: { row, breadCrum },
    });
  };

  
  const ToSitePage = (row) => {
    var breadCrum = breadcrumbs.map((el) => {
      el.active = 0;
      return el;
    });
    breadCrum = [...breadCrum, { title: "Manage Sites", link: `/${localStorage.getItem("role").toLowerCase()}/contractor/managesites/${row._id}`, active: 1 }];
    history.push({ pathname:  `/${localStorage.getItem("role").toLowerCase()}/contractor/managesites/${row._id}`, state: breadCrum });
  };
  
  const ToCylinderPage = (row) => {
    var breadCrum = breadcrumbs.map((el) => {
      el.active = 0;
      return el;
    });
    breadCrum = [...breadCrum, { title: "Manage Cylinder", link: `/${localStorage.getItem("role").toLowerCase()}/contractor/managecylinder/${row._id}`, active: 1 }];
    history.push({ pathname:  `/${localStorage.getItem("role").toLowerCase()}/contractor/managecylinder/${row._id}`, state: {row , breadCrum} });
  };
  
  
  const ViewPage = (row) => {
    var breadCrum = breadcrumbs.map((el) => {
      el.active = 0;
      return el;
    });
    breadCrum = [
      ...breadCrum,
      {
        title: "View Contractor",
        link: `/${localStorage.getItem("role").toLowerCase()}/contractor/view/${row._id}`,
        active: 1,
      },
    ];
    history.push({
      pathname: `/${localStorage.getItem("role").toLowerCase()}/contractor/view/${row._id}`,
      state: { row, breadCrum },
    });
  };

  const handleClick = (e) => {
    // e.preventDefault();
    var breadCrum = breadcrumbs.map((el) => {
      el.active = 0;
      return el;
    });
    breadCrum = [...breadCrum, { title: "Add Contractor", link: `/${localStorage.getItem("role").toLowerCase()}/contractor/add`, active: 1 }];
    history.push({ pathname: `/${localStorage.getItem("role").toLowerCase()}/contractor/add`, state: breadCrum });
  };
  //******//

  const getContractors = useCallback(async () => {
    setApiStatus(apiStatusConstants.inProgress);
    var response = await contractorsDetails(queryParams);

    if (response.status === 200) {
      if (response.data.status === 1) {
        setApiStatus(apiStatusConstants.success);
        setContractorsData(response.data.data.contractorsData);
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
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  }, [queryParams]);

  useEffect(() => {
    getContractors();
  }, [getContractors]);

  const showContrarsSuccessView = () => {
    return (
      <div>
        <ToastContainer />
        <ConfirmBox open={confirmPromt} id={deleteCylinderId} closeDialog={closeDeleteConfirmation} deleteFunction={deleteContractorDetails } />
        <h3>Contractors</h3>
        {breadcrumbs && <BreadCrum breadcrumbs={breadcrumbs} />}
        <div className="d-flex align-item-center justify-content-between my-4">
          <button type="button" className="btn btn-primary" onClick={() => handleClick()}>
            Add{" "}
          </button>
          <div className="d-flex flex-row justify-content-center">
            <Search setSearch={onChangeSearch} />
          </div>
        </div>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                {COLUMNS.map((each) => {
                  return (
                    <StyledTableCell align="center" key={each.id}>
                      <Sortmenu header={each.header} value={each.value} changeSortAndOrder={onChangeSortAndOrder} activeColumn={activeFilterColumn} columnOrder={order} />
                    </StyledTableCell>
                  );
                })}
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center" sx={{ minWidth: "200px" }}>
                  Actions
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contractorsData.length !== 0 ? (
                contractorsData.map((row) => (
                  <StyledTableRow key={row._id}>
                    <StyledTableCell component="th" scope="row" align="center">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.email}</StyledTableCell>
                    <StyledTableCell align="center">{row.status === 1 ? "Active" : "InActive"}</StyledTableCell>
                    <StyledTableCell align="center">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                        }}
                      > 
                      <Tooltip title="View" placement="top" arrow>
                        <div>
                          <i class="fa fa-eye " onClick={() => ViewPage(row)} style={{ cursor: "pointer" }} />
                        </div>
                        </Tooltip>
                        <Tooltip title="Edit" placement="top" arrow>
                        <div>
                          <i class="fa fa-edit" onClick={() => ToNextPage(row)} style={{ cursor: "pointer" }} />
                        </div>
                        </Tooltip>
                        <Tooltip title="Site" placement="top" arrow>
                        <div>
                          <i class="fa fa-map-marker " onClick={() => ToSitePage(row)} style={{ cursor: "pointer" }} />
                        </div>
                        </Tooltip>
                        <Tooltip title="Cylinder" placement="top" arrow>
                        <div>
                        <i   class="fa fa-indent" onClick={()=>ToCylinderPage(row)} style={{ cursor: "pointer" }}></i>
                        </div>
                        </Tooltip>
                        <Tooltip title="Delete" placement="top" arrow>
                        <div>
                        <i class="fa fa-trash" style={{ cursor: "pointer" }} onClick={() => getDeteleteCylinderId(row._id)} />
                        </div>
                        </Tooltip>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <>
                  <StyledTableCell align="center" colSpan={4}>
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

  const renderContractorsData = () => {
    switch ('SUCCESS') {
      case apiStatusConstants.success:
        return showContrarsSuccessView();
      case apiStatusConstants.inProgress:
        return <h1>Loading...</h1>;
      case apiStatusConstants.failure:
        return <h1>Something Went Wrong...</h1>;
      default:
        return <p>null</p>;
    }
  };

  return renderContractorsData();
}
