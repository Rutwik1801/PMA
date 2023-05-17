import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <h1 style={{ textAlign: "center", marginTop: "50px" }}>
        PAGE NOT FOUND!
      </h1>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
        <Button onClick={() => navigate('/')} style={{border: "1px solid blue"}}>Go To Home</Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
