import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { CircularProgress, Box, Typography, List, ListItem, ListItemText, Grid, Paper } from "@mui/material";
import moment from "moment";
import { socket } from "./FetchBusinessData";


export const SocketTest = () => {
  const [progress, setProgress] = useState({
    startDate: "",
    discovered: 0,
    items: [],     
    endDate: "",
    alreadyPresent: 0,
    failed: 0,
    inserted: 0,
    scraped: 0,
  });

  useEffect(() => {
    socket.on('discovered', (data) => {
      setProgress((prev) => ({
        ...prev,
        discovered: prev.discovered + data.discovered,
      }));
    });
  
    socket.on("scrape-progress-item", (data) => {
      console.log("scrape-progress-item", data);
  
      setProgress((prev) => {
        const updatedItems = prev.items.map((item) =>
          item.id === data.id ? { ...item, status: data.status, stats: data.stats } : item
        );
  
        updatedItems.push({ id: data.id, status: data.status, stats: data.stats });
  
        let { alreadyPresent, failed, inserted, scraped } = data.stat || {};
  
        if (data.stat) {
          alreadyPresent = data.stat.alreadyPresent;
          failed = data.stat.failed;
          inserted = data.stat.inserted;
          scraped = data.stat.scraped;
        }
  
        return {
          ...prev,
          items: updatedItems,
          startDate: data.startDate,
          endDate: data.endDate,
          alreadyPresent: prev.alreadyPresent + (alreadyPresent || 0),
          failed: prev.failed + (failed || 0),
          inserted: prev.inserted + (inserted || 0),
          scraped: prev.scraped + (scraped || 0),
        };
      });
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);
  const { items, discovered, inserted, alreadyPresent,failed,scraped } = progress;

  const processedItems = items.length??0;


  const totalDiscovered = discovered > 0 ? discovered : 1;


  const calculatedPercentage = Math.round((processedItems / totalDiscovered) * 100);
  return (
    <Box sx={{ padding: 3, width: "100%" }}>
      <Grid container spacing={3}>
        {/* Left Section: Progress Summary */}
        <Grid item xs={12} sm={6}>
          <Paper sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Scraping Progress
            </Typography>

            {/* Display start and end date only if they exist */}
            {progress.startDate && (
              <Typography variant="subtitle1">Start Date: {moment(progress.startDate).format("LL")}</Typography>
            )}
            {progress.endDate && (
              <Typography variant="subtitle1">End Date: {moment(progress.endDate).format("LL")}</Typography>
            )}

            <Typography variant="subtitle1">Total Discovered: {progress.discovered}</Typography>
            <Typography variant="subtitle1">Success: {progress.inserted}</Typography>
            <Typography variant="subtitle1">Denied: {progress.failed}</Typography>
            <Typography variant="subtitle1">Already in DB: {progress.alreadyPresent}</Typography>
            <Typography variant="subtitle1">Error: {progress.scraped}</Typography>

            {/* Circular Progress */}
            <Box display="flex" justifyContent="center" alignItems="center" position="relative" marginTop={3}>
              <CircularProgress
                variant="determinate"
                value={calculatedPercentage}
                size={100}
                thickness={4}
                color={calculatedPercentage === 100 ? "success" : "primary"}
              />
              <Box sx={{ position: "absolute" }}>
                <Typography variant="h6" color="textSecondary">
                  {calculatedPercentage}%
                </Typography>
              </Box>
            </Box>

            {/* Progress Bar */}
            <Box sx={{ width: "100%", backgroundColor: "#f3f3f3", borderRadius: "8px", marginTop: 2 }}>
              <Box
                sx={{
                  width: `${calculatedPercentage}%`,
                  height: "20px",
                  backgroundColor: calculatedPercentage === 100 ? "green" : "#4caf50",
                  borderRadius: "8px",
                  textAlign: "center",
                  color: "white",
                  lineHeight: "20px",
                }}
              >
                {calculatedPercentage}%
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Scraped Items
            </Typography>

            {/* Scrollable List */}
            <Box sx={{ maxHeight: 400, overflowY: "auto", marginTop: 2 }}>
              <List>
                {progress.items.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`ID: ${item.id}`} secondary={`Status: ${item.status}`} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SocketTest;
