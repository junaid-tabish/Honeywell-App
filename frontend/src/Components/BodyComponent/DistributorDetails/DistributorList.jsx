import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import { deleteDistributor, getDistributorByRole, getCount, getDistributor } from "../../../Services/Admin/Distributor/Controller";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { TOSTIFY_TIME } from "../../../Utils/Constants";
import "./distributorStyle.css";
import BreadCrum from "../../CommonComponent/BreadCrum/BreadCrum";
import { useHistory } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { TableSortLabel } from "@mui/material";
import Search from "../../CommonComponent/SearchBar/SearchBar";
import PaginationModule from "../../CommonComponent/Pagination/PaginationModule";
import ConfirmBox from "../../CommonComponent/ConfirmBox/Confirmbox";
import "../../CommonComponent/SearchBar/search.css";

//  table styling

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

export default function DistributorList() {
  const history = useHistory();
  const [distributors, setDistributors] = useState([]);
  const [page, setPage] = useState(1);
  const [toatalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [title, setTitle] = useState();
  const [distributorDetails, setDistributorDetails] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  //delete distributor
  const [confirmPromt, setConfirmPrompt] = useState(false);
  const [deleteDistributorId, setDeleteDistributorId] = useState("");
  const getDeteleteDistributorId = (id) => {
    setConfirmPrompt(true);
    setDeleteDistributorId(id);
  };

  const closeDeleteConfirmation = () => {
    setConfirmPrompt(false);
    deleteDistributorId("");
  };

  const deleteDistributorDetails = async () => {
    const response = await deleteDistributor(deleteDistributorId);
    if (response.data.status === 1) {
      toast.success(response.data.message);
      setTimeout(() => {
        history.push(`/${localStorage.getItem("role").toLowerCase()}/distributor`);
        setConfirmPrompt(false);
        setDeleteDistributorId("");
        getAllDistributors();
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

  /*****************/

  // Show all distributos
  useEffect(() => {
    (async () => {
      getTotalCount();
      getAllDistributors();
      const rowData = await getDistributorByRole();
      if (rowData.data.status === 1) {
        setDistributorDetails(rowData.data.data);
      }
    })();
  }, [page, search, orderDirection]);

  const url = `?page=${page}&search=${search}&sort=${title}&order=${orderDirection}`;

  const getAllDistributors = async () => {
    const response = await getDistributor(url);
    setDistributors(response.data.data);
  };
  const getTotalCount = async () => {
    const response = await getCount();
    setTotalCount(response.data.data.distributorCount);
  };

  const breadcrumbs = [
    { title: "Dashboard", link: "/admin/dashboard", active: 0 },
    { title: "Distributor", link: "/admin/distributor", active: 1 },
  ];

  const ToNextPage = (row) => {
    var breadCrum = breadcrumbs.map((el) => {
      el.active = 0;
      return el;
    });
    breadCrum = [...breadCrum, { title: "Update Distributor", link: `/admin/distributor/edit/${row._id}`, active: 1 }];
    history.push({ pathname: `/admin/distributor/edit/${row._id}`, state: { row, breadCrum } });
  };

  //my changes start

  const ToSitePage = (row) => {
    var breadCrum = breadcrumbs.map((el) => {
      el.active = 0;
      return el;
    });
    breadCrum = [...breadCrum, { title: "Allocate Site To Distributor", link: `/admin/distributor/managesite/${row._id}`, active: 1 }];
    history.push({ pathname: `/admin/distributor/managesite/${row._id}`, state: { row, breadCrum } });
  };

  const ToBatchPage = (row) => {
    var breadCrum = breadcrumbs.map((el) => {
      el.active = 0;
      return el;
    });
    breadCrum = [...breadCrum, { title: "Allocate Batch To Distributor", link: `/admin/distributor/managebatch/${row._id}`, active: 1 }];
    history.push({ pathname: `/admin/distributor/managebatch/${row._id}`, state: { row, breadCrum } });
  };

  //my changes end

  const ViewPage = (row) => {
    var breadCrum = breadcrumbs.map((el) => {
      el.active = 0;
      return el;
    });
    breadCrum = [...breadCrum, { title: "View Distributor", link: `/admin/distributor/view/${row._id}`, active: 1 }];
    history.push({ pathname: `/admin/distributor/view/${row._id}`,state: { row, breadCrum } });
  };

  function handleSortRequestOnName() {
    setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
    setTitle("name");
  }

  const handleClick = (e) => {
    // e.preventDefault();
    var breadCrum = breadcrumbs.map((el) => {
      el.active = 0;
      return el;
    });
    breadCrum = [...breadCrum, { title: "Add Distributor", link: "/admin/distributor/add", active: 1 }];
    history.push({ pathname: "/admin/distributor/add", state: breadCrum });
  };

  return (
    <>
      <ConfirmBox open={confirmPromt} id={deleteDistributorId} closeDialog={closeDeleteConfirmation} deleteFunction={deleteDistributorDetails } />
      <h3>Distributor</h3>
      {breadcrumbs && <BreadCrum breadcrumbs={breadcrumbs} />}
      <div>
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
            <Search setSearch={(search) => setSearch(search)} />
          </div>
        </div>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Sr.No</StyledTableCell>
                <StyledTableCell align="center" onClick={handleSortRequestOnName}>
                  Distributor Name
                  <TableSortLabel align="center" active={title === "name" ? true : false} direction={orderDirection}></TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align="center">Email ID</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {distributorDetails &&
                distributors &&
                distributors.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell component="th" scope="row" align="center">
                      {i + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">{row.email}</StyledTableCell>
                    <StyledTableCell align="center">
                      <div className="icons">
                        <ToastContainer />
                        <Tooltip title="View" placement="top" arrow>
                          <div>
                            <i className="fa fa-eye icon" onClick={() => ViewPage(row)} />
                          </div>
                        </Tooltip>
                        <Tooltip title="Edit" placement="top" arrow>
                          <div>
                            <i className="fa fa-edit icon" onClick={() => ToNextPage(row)} />
                          </div>
                        </Tooltip>
                        <Tooltip title="Site" placement="top" arrow>
                          <div>
                            <i className="fa fa-map-marker icon" onClick={() => ToSitePage(row)} />
                          </div>
                        </Tooltip>
                        <Tooltip title="Batch" placement="top" arrow>
                          <div>
                            <i className="fa fa-tag icon" onClick={() => ToBatchPage(row)} />
                          </div>
                        </Tooltip>
                        <Tooltip title="Delete" placement="top" arrow>
                          <div>
                            <button
                              type="button"
                              className="border-0 bg-transparent"
                              data-toggle="modal"
                              data-target="#exampleModal"
                              onClick={() => getDeteleteDistributorId(row._id)}
                              style={{cursor: 'pointer'}}
                            >
                              <i className="fa fa-trash"/>
                            </button>
                          </div>
                        </Tooltip>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="mt-2 pull-right">
          <PaginationModule page={page} count={Math.ceil(toatalCount / 5)} setPage={(page) => setPage(page)} />
        </div>
      </div>
    </>
  );
}
