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
  getAllotedBatchesOfDistributors,
  getDistributorById,
  updateAllotedBatch,
} from "../../../Services/Admin/Distributor/Controller.js";
import { useEffect, useState } from "react";
import ConfirmBox from "../../CommonComponent/ConfirmBox/Confirmbox.js";
import { TOSTIFY_TIME } from "../../../Utils/Constants.js";
import { ToastContainer, toast } from "react-toastify";
import { Card, CardContent } from "@mui/material";
import BreadCrum from "../../CommonComponent/BreadCrum/BreadCrum.js";

export default function ManageBatches() {
  const breadcrumbs = [
    { title: "Dashboard", link: "/admin/dashboard", active: 0 },
    { title: "Distributor", link: "/admin/distributor", active: 0 },
    { title: "Manage Batches", link: "/admin/distributor/Batch", active: 1 },
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
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
  useEffect(() => {
    getAllBatches();
    getDistributorDetails();
  }, []);

  const [batches, setBatches] = useState([]);
  const [details, setDetails] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({});

  const { id } = useParams();
  const history = useHistory();

  const getAllBatches = async () => {
    const res = await getAllotedBatchesOfDistributors(id);
    setBatches(res.data.data);
  };

  const getDistributorDetails = async () => {
    const res = await getDistributorById(id);
    setDetails(res.data.data);
  };

  function openDelete(data) {
    setOpen(true);
    setDeleteData(data);
  }

  const handleonDelete = async (e) => {
    // e.preventDefault();
    setOpen(false);
    const res = await updateAllotedBatch(id, deleteData);
    if (Number(res.data.status) === 1) {
      toast.success(res.data.message);
      setTimeout(() => {
        history.push("/admin/distributor");
      }, TOSTIFY_TIME);
    } else {
      toast.error(res.data.message);
    }
  };

  return (
    <>
      <h3>Manage Batches</h3>
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
              <div>
                <h4>Distributor Details:</h4>
              </div>
              <div className="p-3">
                <label> Name: {details.name}</label>
              </div>
              <div className="d-flex align-item-center justify-content-between my-4">
                <Link
                  to={`/admin/distributor/batch/${id}`}
                  style={{ display: "flex" }}
                >
                  <button type="buttosn" className="btn btn-primary">
                    Assign Batch{" "}
                  </button>
                </Link>
                <Link to="/admin/distributor">
                  <button className="btn btn-primary ml-4">Cancel</button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <div>
        <ToastContainer />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Sr. No</StyledTableCell>
                <StyledTableCell align="center">Batch Id</StyledTableCell>
                <StyledTableCell align="center">Batch Name</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {batches.length !== 0 ? (
                batches.map((batch, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell
                      component="th"
                      scope="batches"
                      align="center"
                    >
                      {i + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {batch.batchId}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {batch.batchName}
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
                            onClick={() => openDelete(batch)}
                            className="fa fa-trash"
                            style={{ cursor: "pointer" }}
                          />
                        </div>
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
      </div>
      <ConfirmBox
        open={open}
        closeDialog={() => setOpen(false)}
        deleteFunction={handleonDelete}
      />
    </>
  );
}
