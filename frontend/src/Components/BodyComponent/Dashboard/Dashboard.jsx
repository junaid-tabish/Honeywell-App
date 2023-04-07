import React, { useEffect, useState } from "react";
import { Box, Card, Grid, Typography } from "@material-ui/core";
import "./DashboardStyles.css";
import { USER_ADMIN, USER_CONTRACTOR, USER_DISTRIBUTOR } from "../../../Utils/Constants";
import { getCount, getInventoryCount } from "../../../Services/Dashboard/Controller";

export default function Dashboard() {


  const [count, setCount] = useState({
    batchCount: "0",
    contractorCount: "0",
    distributorCount: "0",
    siteCount: "0",
   
  });

  const [inventoryCounter,setInventoryCounter]=useState({
    cylinderCount: "0",
    emptyCylinderCount: "0",
    replacementRequestCount: "0",
    unsignedCylinderCount: "0",
  })

  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    (async () => {
      try {
        const resData = await getCount();
        const res=await getInventoryCount();
        console.log(res)
        if (resData.data.status === 1&& res.data.status===1) {
          setCount({
            ...count,
            batchCount: resData.data.data.batchCount,
            contractorCount: resData.data.data.contractorCount,
            distributorCount: resData.data.data.distributorCount,
            siteCount: resData.data.data.siteCount,
            
          });
          setInventoryCounter({
            ...inventoryCounter,
            cylinderCount:res.data.data.cylinderCount,
            emptyCylinderCount:res.data.data.emptyCylinderCount,
            replacementRequestCount:res.data.data.replacementRequestCount,
            unsignedCylinderCount:res.data.data.unsignedCylinderCount,


          })
        }
      } catch (err) {}
    })();
  }, []);

  return (
    <Box >
      <Typography className="main-heading" variant="h3" gutterBottom style={{ "fontSize": "30px" }}>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        <>
          {role === USER_ADMIN && (
            <>
              <Grid item xs={6} sm={3}>
                <Card className="hoverCard">
                  <div className="cardbody">
                  <div >
                    <center>
                    <p>
                      Distributor Count
                    </p>
                    <p >
                      {count?.distributorCount}
                    </p>
                    </center>
                  </div>
                  </div>
                </Card>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Card className="hoverCard">
                  <div className="cardbody">
                  <div >
                    <center>
                    <p>
                    Contractor Count
                    </p>
                    <p >
                      {count?.contractorCount}
                    </p>
                    </center>
                  </div>
                  </div>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card className="hoverCard">
                  <div className="cardbody">
                  <div >
                    <center>
                    <p>
                    Site Count
                    </p>
                    <p >
                      {count?.siteCount}
                    </p>
                    </center>
                  </div>
                  </div>
                </Card>
              </Grid>  

              <Grid item xs={6} sm={3}>
                <Card className="hoverCard">
                  <div className="cardbody">
                  <div >
                    <center>
                    <p>
                    Batch Count
                    </p>
                    <p >
                      {count?.batchCount}
                    </p>
                    </center>
                  </div>
                  </div>
                </Card>
              </Grid>

              <div className="container-fluid" style={{marginTop:"40px"}} ><h5>Cylinder Details</h5></div>
              

          <Grid item xs={6} sm={3}>
                <Card className="hoverCard">
                  <div className="cardbody">
                  <div >
                    <center>
                    <p>
                    Total Cylinder Count
                    </p>
                    <p >
                    {inventoryCounter?.cylinderCount}
                    </p>
                    </center>
                  </div>
                  </div>
                </Card>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Card className="hoverCard">
                  <div className="cardbody">
                  <div >
                    <center>
                    <p>
                    Empty Cylinder Count
                    </p>
                    <p >
                    {inventoryCounter?.emptyCylinderCount}
                    </p>
                    </center>
                  </div>
                  </div>
                </Card>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Card className="hoverCard">
                  <div className="cardbody">
                  <div >
                    <center>
                    <p>
                    Replacement Cylinder Count
                    </p>
                    <p >
                    {inventoryCounter?.replacementRequestCount}
                    </p>
                    </center>
                  </div>
                  </div>
                </Card>
              </Grid>


              <Grid item xs={6} sm={3}>
                <Card className="hoverCard">
                  <div className="cardbody">
                  <div >
                    <center>
                    <p>
                    Unsigned Cylinder Count
                    </p>
                    <p >
                    {inventoryCounter?.unsignedCylinderCount}
                    </p>
                    </center>
                  </div>
                  </div>
                </Card>
              </Grid>


              
              
            </>
          )}

          {role === USER_DISTRIBUTOR && ( 
            <>
            <Grid item xs={6} sm={3}>
           <Card className="hoverCard">
             <div className="cardbody">
             <div >
               <center>
               <p>
               Contractor Count
               </p>
               <p >
                 {count?.contractorCount}
               </p>
               </center>
             </div>
             </div>
           </Card>
         </Grid>

         <Grid item xs={6} sm={3}>
                <Card className="hoverCard">
                  <div className="cardbody">
                  <div >
                    <center>
                    <p>
                    Site Count
                    </p>
                    <p >
                      {count?.siteCount}
                    </p>
                    </center>
                  </div>
                  </div>
                </Card>
              </Grid>  

              <Grid item xs={6} sm={3}>
                <Card className="hoverCard">
                  <div className="cardbody">
                  <div >
                    <center>
                    <p>
                    Batch Count
                    </p>
                    <p >
                      {count?.batchCount}
                    </p>
                    </center>
                  </div>
                  </div>
                </Card>
              </Grid>

              <div className="container-fluid" style={{marginTop:"40px"}} ><h5>Cylinder Details</h5></div>
              

          <Grid item xs={6} sm={3}>
                <Card className="hoverCard">
                  <div className="cardbody">
                  <div >
                    <center>
                    <p>
                    Total Cylinder Count
                    </p>
                    <p >
                    {inventoryCounter?.cylinderCount}
                    </p>
                    </center>
                  </div>
                  </div>
                </Card>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Card className="hoverCard">
                  <div className="cardbody">
                  <div >
                    <center>
                    <p>
                    Empty Cylinder Count
                    </p>
                    <p >
                    {inventoryCounter?.emptyCylinderCount}
                    </p>
                    </center>
                  </div>
                  </div>
                </Card>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Card className="hoverCard">
                  <div className="cardbody">
                  <div >
                    <center>
                    <p>
                    Replacement Cylinder Count
                    </p>
                    <p >
                    {inventoryCounter?.replacementRequestCount}
                    </p>
                    </center>
                  </div>
                  </div>
                </Card>
              </Grid>


              <Grid item xs={6} sm={3}>
                <Card className="hoverCard">
                  <div className="cardbody">
                  <div >
                    <center>
                    <p>
                    Unsigned Cylinder Count
                    </p>
                    <p >
                    {inventoryCounter?.unsignedCylinderCount}
                    </p>
                    </center>
                  </div>
                  </div>
                </Card>
              </Grid>

         
            </>
           
          )}

           {(role === USER_CONTRACTOR &&
            <>
            <Grid item xs={6} sm={3}>
                <Card className="hoverCard">
                  <div className="cardbody">
                  <div >
                    <center>
                    <p>
                    Site Count
                    </p>
                    <p >
                      {count?.siteCount}
                    </p>
                    </center>
                  </div>
                  </div>
                </Card>
              </Grid>  

              <Grid item xs={6} sm={3}>
                <Card className="hoverCard">
                  <div className="cardbody">
                  <div >
                    <center>
                    <p>
                    Batch Count
                    </p>
                    <p >
                      {count?.batchCount}
                    </p>
                    </center>
                  </div>
                  </div>
                </Card>
              </Grid>

              <div className="container-fluid" style={{marginTop:"40px"}} ><h5>Cylinder Details</h5></div>
              

          <Grid item xs={6} sm={3}>
                <Card className="hoverCard">
                  <div className="cardbody">
                  <div >
                    <center>
                    <p>
                    Total Cylinder Count
                    </p>
                    <p >
                    {inventoryCounter?.cylinderCount}
                    </p>
                    </center>
                  </div>
                  </div>
                </Card>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Card className="hoverCard">
                  <div className="cardbody">
                  <div >
                    <center>
                    <p>
                    Empty Cylinder Count
                    </p>
                    <p >
                    {inventoryCounter?.emptyCylinderCount}
                    </p>
                    </center>
                  </div>
                  </div>
                </Card>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Card className="hoverCard">
                  <div className="cardbody">
                  <div >
                    <center>
                    <p>
                    Replacement Cylinder Count
                    </p>
                    <p >
                    {inventoryCounter?.replacementRequestCount}
                    </p>
                    </center>
                  </div>
                  </div>
                </Card>
              </Grid>


              <Grid item xs={6} sm={3}>
                <Card className="hoverCard">
                  <div className="cardbody">
                  <div >
                    <center>
                    <p>
                    Unsigned Cylinder Count
                    </p>
                    <p >
                    {inventoryCounter?.unsignedCylinderCount}
                    </p>
                    </center>
                  </div>
                  </div>
                </Card>
              </Grid>

            </>
            )}
              
        </>
      </Grid>
    </Box>
  );
}
