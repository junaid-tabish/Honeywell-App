import {
    Button,
    Dialog,
    DialogContent,
    Fade,
    Grid,
    IconButton,
    Typography,
  } from "@mui/material";
  import { Box } from "@mui/system";
  import React, { forwardRef } from "react";
  
  
  
  const Transition = forwardRef(function Transition(props, ref) {
    return <Fade ref={ref} {...props} />;
  });
  
  function ConfirmBox({ open, closeDialog ,deleteFunction}) {
    return (
      <Dialog
        open={open}
        maxWidth="sm"
        scroll="body"
        onClose={closeDialog}
        TransitionComponent={Transition}
      >
        <DialogContent sx={{ px: 8, py: 6, position: "relative" }}>
          <IconButton
            size="medium"
            onClick={closeDialog}
            sx={{ position: "absolute", right: "1rem", top: "1rem" }}
          >
            X
          </IconButton>
  
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Box
                sx={{
                  mb: 3,
                  display: "flex",
                  justifyContent: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6"> Are you sure you want to continue? </Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "between", gap: "1rem" }}
            >
              <Button onClick={closeDialog} size="medium" variant="contained" sx={{background: 'hsl(217, 96%, 49%)'}}>
                No
              </Button>
              <Button onClick={deleteFunction}  size="medium" variant="contained" color="error">
                Yes
              </Button>{" "}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }
  
  export default ConfirmBox;