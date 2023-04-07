import React from "react";
import "./footer.css";
import { Box, Grid, Typography } from "@material-ui/core";

export default function FooterComponent() {
  return (
    <div className="FooterDiv">
      <Box className="footercontainer">
     
     <Typography className="footer" variant="body1">
       All right reserved @Honeywell 2023
     </Typography>
   
</Box>
    </div>
  );
}
