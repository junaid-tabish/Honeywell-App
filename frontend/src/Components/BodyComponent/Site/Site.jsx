import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import React, { useState, useEffect } from "react";
import { TOSTIFY_TIME } from "../../../Utils/Constants";
import { ToastContainer, toast } from "react-toastify";
import {
  Getsite,
  Deletesite,
  getCount,
} from "../../../Services/Admin/Sites/Controller";
import { useHistory } from "react-router";
import BreadCrum from "../../CommonComponent/BreadCrum/BreadCrum";
import ConfirmBox from "../../CommonComponent/ConfirmBox/Confirmbox";
import Search from "../../CommonComponent/SearchBar/Search";
import PaginationModule from "../../CommonComponent/Pagination/PaginationModule";
import { TableSortLabel } from "@material-ui/core";
import jwtDecode from "jwt-decode";
import "../../CommonComponent/SearchBar/search.css";

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

export default function Site(props) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [toatalCount, setTotalCount] = useState(0);
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [deleteData, setDeleteData] = useState({});
  const [orderDirection, setOrderDirection] = useState("asc");
  const [title, setTitle] = useState();
  const [proData, setData] = useState([]);

  const breadcrumbs = [
    {
      title: "Dashboard",
      link: `/${localStorage.getItem("role").toLowerCase()}/dashboard`,
      active: 0,
    },
    {
      title: "Sites",
      link: `/${localStorage.getItem("role").toLowerCase()}/site`,
      active: 1,
    },
  ];
  useEffect(() => {
    FetchData();
    getTotalCount();
  }, [page, search, orderDirection]);
  const url = `?page=${page}&search=${search}&sort=${title}&order=${orderDirection}`;
  const tok = jwtDecode(localStorage.getItem("token"));
  console.log(tok);
  const FetchData = () => {
    Getsite(url).then((res) => {
      console.log(res.data.data);
      if (localStorage.getItem("role") == "Admin") {
        setData(res.data.data);
      } else if (localStorage.getItem("role") == "Distributor") {
        let disfil = res.data.data.filter(
          (dis) => {
            if(dis.isAssignedToDistributor){
                if(tok.userID == dis.distributorId._id){
                  return dis
                }
            }
            
          }
        );
        setData(disfil);
      } else if (localStorage.getItem("role") == "Contractor") {
        let confil = res.data.data.filter(
          (con) => {
             if(con.isAssignedToContractor){
              if(tok.userID == con.contractorId._id){
                return con
              }
             }  
            
          }
        );
        setData(confil);
      }
    });
  };

  const getTotalCount = async () => {
    const response = await getCount();
    console.log(response.data.data.siteCount);
    setTotalCount(response.data.data.siteCount);
  };
  function openDelete(data) {
    setOpen(true);
    setDeleteData(data);
  }

  // for delete site
  const handleonDelete = (id) => {
    console.log(id);
    setOpen(false);
    Deletesite(deleteData._id).then((res) => {
      if (Number(res.data.status) === 1) {
        toast.success(res.data.message);
        setTimeout(() => {
          FetchData();
        }, TOSTIFY_TIME);
      } else {
        toast.error(res.data.message);
      }
    });
    FetchData();
  };

  // Function for Pass BreadCrum
  const ToNextPage = (pro) => {
    var breadCrum = breadcrumbs.map((el) => {
      el.active = 0;
      return el;
    });
    breadCrum = [
      ...breadCrum,
      {
        title: "Update Site",
        link: `/${localStorage.getItem("role").toLowerCase()}/site/edit/${
          pro._id
        }`,
        active: 1,
      },
    ];
    history.push({
      pathname: `/${localStorage.getItem("role").toLowerCase()}/site/edit/${
        pro._id
      }`,
      state: { pro, breadCrum },
    });
  };

  const handleClick = (e) => {
    var breadCrum = breadcrumbs.map((el) => {
      el.active = 0;
      return el;
    });
    breadCrum = [
      ...breadCrum,
      {
        title: "Add Site",
        link: `/${localStorage.getItem("role").toLowerCase()}/site/add`,
        active: 1,
      },
    ];
    history.push({
      pathname: `/${localStorage.getItem("role").toLowerCase()}/site/add`,
      state: breadCrum,
    });
  };

  // For sorting
  function handleSortRequestOnName() {
    setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
    setTitle("siteName");
  }
  console.log("prodata", proData);
  return (
    <>
      <h3>Sites</h3>

      {breadcrumbs && <BreadCrum breadcrumbs={breadcrumbs} />}
      <div>
        <div className="d-flex align-item-center justify-content-between my-4">
          {localStorage.getItem("role") !== "Contractor" && localStorage.getItem("role") !== "Distributor" ? (
            <button
              type="button"
              className="add-btn btn-info"
              onClick={() => {
                handleClick();
              }}
            >
              Add
            </button>
          ) : (
            ""
          )}
          {/* </Link> */}
          <Search setSearch={(search) => setSearch(search)} />
        </div>
        <ToastContainer />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell
                  align="center"
                  onClick={handleSortRequestOnName}
                >
                  Site Name{" "}
                  <TableSortLabel
                    align="center"
                    active={title === "siteName" ? true : false}
                    direction={orderDirection}
                  ></TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align="center">Latitude</StyledTableCell>
                <StyledTableCell align="center">Longitude</StyledTableCell>
                <StyledTableCell align="center">Ditsributor </StyledTableCell>
                <StyledTableCell align="center">Contractor </StyledTableCell>
                <StyledTableCell
                  align="center"
                  onClick={handleSortRequestOnName}
                >
                  Status
                  <TableSortLabel
                    align="center"
                    active={title === "status" ? true : false}
                    direction={orderDirection}
                  ></TableSortLabel>
                </StyledTableCell>
                {localStorage.getItem("role") == "Admin" && (
                  <>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {proData.length !== 0 ? (
                proData?.map((pro) => (
                  <>
                    <StyledTableRow key={pro.siteName}>
                      <StyledTableCell
                        component="th"
                        scope="pro"
                        align="center"
                      >
                        {pro.siteName}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {pro.latitude}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {pro.longitude}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {pro.distributorId?.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {pro.contractorId?.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {pro.status === 1 ? "Active" : "Inactive"}
                      </StyledTableCell>
                      {localStorage.getItem("role") == "Admin" && (
                        <>
                          <StyledTableCell align="center">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "10px",
                              }}
                            >
                              <div>
                                <i
                                  className="fa fa-edit icon"
                                  onClick={() => ToNextPage(pro)}
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => openDelete(pro)}
                                className="border-0 bg-transparent"
                                data-toggle="modal"
                                data-target="#exampleModal"
                              >
                                <i className="fa fa-trash icon" />
                              </button>
                            </div>
                          </StyledTableCell>
                        </>
                      )}
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
          <PaginationModule
            page={page}
            count={Math.ceil(toatalCount / 5)}
            setPage={(page) => setPage(page)}
          />
        </div>
      </div>
      <ConfirmBox
        open={open}
        closeDialog={() => setOpen(false)}
        deleteFunction={handleonDelete}
      />
    </>
  );
}
