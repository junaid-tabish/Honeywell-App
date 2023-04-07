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
  
  function ConfirmBox({ open, closeDialog, deleteFunction}) {
	return (
	  <Dialog
		open={open}
		maxWidth="sm"
		scroll="body"
		onClose={closeDialog}
		TransitionComponent={Transition}
	  >
		<DialogContent sx={{ px: 6, py: 4, position: "relative" }}>
		  <IconButton
			size="medium"
			onClick={closeDialog}
			sx={{ position: "absolute", right: "1rem", top: "1rem"}}
		  >
			<b>x</b>
		  </IconButton>
  
		  <Grid container spacing={2}>
			<Grid item xs={12}>
			  <Box
				sx={{
				  mb: 3,
				  display: "flex",
				  justifyContent: "flex-start",
				  flexDirection: "column",
				}}
			  >
				<Typography variant="h5"> Are you sure you want to continue? </Typography>
			  </Box>
			</Grid>
			<center>
			<Grid item sx={{ display: "flex", justifyContent: "between", gap: "1.5rem",paddingLeft:"166px" }}>
				<Button onClick={deleteFunction}  size="medium" variant="contained" color="error">
				Yes
			  </Button>
			  <Button onClick={closeDialog} size="medium" variant="contained" color="primary">
				No
			  </Button>
			  
			</Grid>
			</center>
		  </Grid>
		</DialogContent>
	  </Dialog>
	);
  }
  
  export default ConfirmBox;
  