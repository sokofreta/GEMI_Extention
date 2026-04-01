import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { CircularProgress, LinearProgress } from "@mui/material";

export default function StartScraper({ selectedRange, url, stop, onComplete }) {
  const [status, setStatus] = useState("idle"); 
  const { data, loading, error, progress } = useFetch(`http://localhost:1000/${url}`, {
    method: "POST",
    data: {
      range: selectedRange,
      url: "ordino",
      stop: stop,
    },
  });

  useEffect(() => {
    if (loading) {
      setStatus("loading");
    } else if (error) {
      setStatus("error");
    } else if (data) {
      setStatus("success");
      if (onComplete) {
        onComplete();
      }
    }
  }, [loading, error, data, onComplete]);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {status === "loading" && (
        <>
          <CircularProgress />
          <LinearProgress variant="determinate" value={progress} style={{ width: "100%", marginTop: "10px" }} />
        </>
      )}
      {status === "error" && <div>Error: {error.message}</div>}
      {status === "success" && <div>{data.status}</div>}
      {status === "idle" && <div>Waiting to start...</div>}
    </div>
  );
}