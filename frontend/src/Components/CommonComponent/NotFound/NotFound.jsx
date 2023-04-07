import React from "react";
import { Container } from "@mui/material";
export default function NotFound() {
  return (
    <div className="main">
      <Container style={{ padding: "300px" }}>
        <h1
          className="text-center servererror words word-1"
          style={{ color: "#3f51b5" }}
        >
          <span>! </span>
          <span>4</span>
          <span>0</span>
          <span>4</span>
        </h1>
        <h3 className=" text-center servererror words word-1">
          <span>! </span>
          <span>O</span>
          <span>P</span>
          <span>P</span>
          <span>S</span>
          <span>S</span>
        </h3>
        <p className=" text-center servererror words word-1">
          <span>PAGE NOTFOUND</span>
        </p>
      </Container>
    </div>
  );
}
