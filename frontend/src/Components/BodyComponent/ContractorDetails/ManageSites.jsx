import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  deleteSite,
  getContractor,
  siteAlloted,
} from "../../../Services/Admin/Contractor/Controller.js";
import { useEffect, useState } from "react";
import ConfirmBox from "../../../Components/CommonComponent/ConfirmBox/Confirmbox";
import { TOSTIFY_TIME } from "../../../Utils/Constants.js";
import { ToastContainer, toast } from "react-toastify";
import { Card, CardContent } from "@mui/material";
import BreadCrum from "../../CommonComponent/BreadCrum/BreadCrum.js";
import { useLocation } from "react-router-dom";

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

export default function ManageSites() {
  useEffect(() => {
    getAllSites();
    getContractorDetails();
  }, []);

  const [sites, setSites] = useState([]);
  const [details, setDetails] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  // const location = useLocation()

  const { id } = useParams();
  const history = useHistory();

  const breadcumData = [
    {
      title: "Dashboard",
      link: `/${localStorage.getItem("role").toLowerCase()}/dashboard`,
      active: 0,
    },
    {
      title: "Contractor",
      link: `/${localStorage.getItem("role").toLowerCase()}/contractor`,
      active: 0,
    },
    {
      title: "Manage Sites",
      link: `/admin/contractor/managesites/${id}`,
      active: 1,
    },
  ];

  const breadcrumbs = [
    {
      title: "Dashboard",
      link: `/${localStorage.getItem("role").toLowerCase()}/dashboard`,
      active: 0,
    },
    {
      title: "Contractor",
      link: `/${localStorage.getItem("role").toLowerCase()}/contractor`,
      active: 0,
    },
    {
      title: "Manage Sites",
      link: `/${localStorage
        .getItem("role")
        .toLowerCase()}/contractor/managesites/${id}`,
      active: 1,
    },
  ];
  const getAllSites = async () => {
    const res = await siteAlloted(id);
    console.log(res.data.data);
    setSites(res.data.data);
  };

  const getContractorDetails = async () => {
    const res = await getContractor(id);
    setDetails(res.data.data);
  };

  function openDelete(data) {
    setOpen(true);
    setDeleteData(data);
  }

  const ToSitePage = (row) => {
    history.push({
      pathname: `/${localStorage
        .getItem("role")
        .toLowerCase()}/contractor/allotsites/${id}`,
    });
  };
  function openDelete(data) {
    
    setOpen(true);
    setDeleteData(data);
  }
      const handleonDelete = async (e) => {
        setOpen(false)
         const res= await deleteSite(id,deleteData)
         console.log(res);
         if (Number(res.data.status) === 1) {
            toast.success(res.data.message);
            setTimeout(() => {
              history.push(`${id}`);
            }, TOSTIFY_TIME);
          }
            else {
              toast.error(res.data.message);
            }
           getAllSites();
        }
        console.log(details)
        function openDelete(data) {
          setOpen(true);
          setDeleteData(data);
      }
  return (
    <>
      <div>
        <div>
          <h3>Manage Sites</h3>
          {breadcrumbs && <BreadCrum breadcrumbs={breadcrumbs} />}

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
                  <h4>Contractor Details:</h4>
                </div>
                <div className="p-3">
                  <label> Name: {details.name}</label>
                </div>
                <div className="d-flex align-item-center justify-content-center">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={ToSitePage}
                  >
                    Assign Sites{" "}
                  </button>
                  <Link to={`/${localStorage.getItem("role").toLowerCase()}/contractor`}>
                  <button className="btn btn-primary ml-4">Cancel</button>
                </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        <ToastContainer />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Sr No</StyledTableCell>
                <StyledTableCell align="center">Site Name</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sites.length !== 0 ? (
                sites.map((site, i) => (
                  <StyledTableRow key={site.name}>
                    <StyledTableCell
                      component="th"
                      scope="sites"
                      align="center"
                    >
                      {i+1}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {site.siteName}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <div>
                          <i
                            type="button"
                            onClick={() => openDelete(site)}
                            style={{ cursor: "pointer" }}
                            class="fa fa-trash "
                          />
                        </div>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <>
                  <StyledTableCell align="center" colSpan={3}>
                    No Data Found
                  </StyledTableCell>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <ConfirmBox
        open={open}
        closeDialog={() => setOpen(false)}
        deleteFunction={handleonDelete}
      />
    </>
  );
}
