import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CircularProgress,
  Button,
  TextField,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import DateRangePicker from "./DateRangePicker";
import { generateOptions } from "./ScrapBusinessInfo";
import Select from "react-select";
import { SocketTest } from "./SocketTest";
import { io } from "socket.io-client";
import { regionOptions, statusOptions } from "./config/config";
import { customStyles } from "./styles/businessPortal.styled";

export const socket = io("http://localhost:1000", {
  transports: ["websocket", "polling"],
});

const FetchBusinessData = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [inputText, setInputText] = useState("");
  const [status, setStatus] = useState(
    statusOptions.find((option) => option.value === "Ενεργή")
  );
  const [region, setRegion] = useState(
    regionOptions.find((option) => option.value === "Κεντρική Μακεδονία")
  );
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [delay, setDelay] = useState(1);
  const [delayOptions, setDelayOptions] = useState([]);
  const [oneToOne, setOneToOne] = useState(false);

  // New state for handling activities
  const [activities, setActivities] = useState([]);
  const [activityInput, setActivityInput] = useState("");

  useEffect(() => {
    if (
      startDate &&
      endDate &&
      (endDate - startDate) / (1000 * 60 * 60 * 24) > 1
    ) {
      setDelayOptions(generateOptions(1, 10, 1, "seconds"));
    } else {
      setDelayOptions([]);
      setDelay(0);
    }
  }, [startDate, endDate]);

  const fetchData = async () => {
    if (!startDate || !endDate || !status || !region) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:1000/businessportal/business`,
        {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            tk: inputText.trim(),
            status: status.value,
            region: region.value,
            delay: delay > 1 ? delay : 0,
            oneToOne,
            activities: activities.join(", "), // Add activities as a comma-separated string
          },
        }
      );
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = () => {
    if (activityInput.trim() && !activities.includes(activityInput.trim())) {
      setActivities([...activities, activityInput.trim()]);
      setActivityInput("");
    }
  };

  const handleRemoveActivity = (index) => {
    const newActivities = activities.filter((_, i) => i !== index);
    setActivities(newActivities);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="80%"
      maxWidth="600px"
      mx="auto"
      height="800px"
      p={3}
      borderRadius="12px"
      boxShadow="0 4px 8px rgba(0,0,0,0.1)"
      bgcolor="#fff"
      overflow="auto"
    >
      <Typography variant="h5" fontWeight="700" gutterBottom>
        Scrap Business Per Date
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} width="100%">
        <Box display="flex" alignItems="center" width="100%" gap={5}>
          <Box
            display="flex"
            flexDirection="column"
            width="50%"
            marginRight={2}
          >
            <Typography variant="subtitle1">Start Date:</Typography>
            <DateRangePicker selected={startDate} onChange={setStartDate} />
          </Box>

          <Box display="flex" flexDirection="column" width="50%">
            <Typography variant="subtitle1">End Date:</Typography>
            <DateRangePicker selected={endDate} onChange={setEndDate} />
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle1">Postal Code:</Typography>
          <TextField
            placeholder="55555 example"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            variant="outlined"
            InputProps={{
              style: { borderRadius: 8, fontSize: "1rem" },
            }}
          />
        </Box>

        <Box>
          <Typography variant="subtitle1">Status:</Typography>
          <Select
            value={status}
            onChange={setStatus}
            options={statusOptions}
            placeholder="Επιλέξτε Κατάσταση"
            styles={customStyles}
          />
        </Box>

        <Box>
          <Typography variant="subtitle1">Region:</Typography>
          <Select
            value={region}
            onChange={setRegion}
            options={regionOptions}
            placeholder="Επιλέξτε Περιοχή"
            styles={customStyles}
          />
        </Box>

        {delayOptions.length > 0 && (
          <Box>
            <Typography variant="subtitle1">Delay (seconds):</Typography>
            <Select
              value={delayOptions.find((option) => option.value === delay)}
              onChange={(selectedOption) => setDelay(selectedOption.value)}
              options={delayOptions}
              styles={customStyles}
            />
          </Box>
        )}

        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={oneToOne}
                onChange={(e) => setOneToOne(e.target.checked)}
              />
            }
            label="1-1 Mode"
          />
        </Box>

        {/* Activity Input Section */}
        <Box>
          <Typography variant="subtitle1">Activity:</Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              placeholder="Enter activity"
              value={activityInput}
              onChange={(e) => setActivityInput(e.target.value)}
              variant="outlined"
              InputProps={{
                style: { borderRadius: 8, fontSize: "1rem" },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddActivity}
              disabled={!activityInput.trim()}
            >
              Add
            </Button>
          </Box>
          {activities.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2">Added Activities:</Typography>
              {activities.map((activity, index) => (
                <Box key={index} display="flex" alignItems="center" gap={1}>
                  <Typography>{activity}</Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleRemoveActivity(index)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Box textAlign="center">
          {!loading && (
            <Button
              variant="contained"
              color="primary"
              onClick={fetchData}
              disabled={!startDate || !endDate || !status || !region}
              style={{
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "1rem",
              }}
            >
              Start Scrape
            </Button>
          )}
          {loading && <CircularProgress size={30} />}
        </Box>

        {error && <Typography color="error">{error}</Typography>}
      </Box>
      <SocketTest />
    </Box>
  );
};

export default FetchBusinessData;
