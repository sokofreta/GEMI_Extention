import React from "react";
import FetchBusinessData from "./FetchBusinessData.jsx";

export const BusinessPortal = () => {
  return (
    //style={{ width: "100%", flexWrap: "wrap", justifyContent: "center", display: "flex", padding: 10, gap: 50,height:"100%" }}
    <div className="portal-container" >
      <FetchBusinessData />
    </div>
  );
};
