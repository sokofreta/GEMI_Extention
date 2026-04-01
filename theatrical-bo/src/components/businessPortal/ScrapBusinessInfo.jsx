import React, { useState } from "react";
import axios from "axios";
import { CircularProgress, Box, Typography, Button } from "@mui/material";
import Select from "react-select";

const ScrapBusinessInfo = () => {
  const [range, setRange] = useState(10);
  const [page, setPage] = useState(1);
  const [delay, setDelay] = useState(1000);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);

  const rangeOptions = generateOptions(10, 5000, 10, "IDs");
  const delayOptions = generateOptions(1, 10, 1, "seconds");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:1000/businessportal/details`, {
        params: {
          limit: range,
          page: page,
          delay: delay,
        },
      });
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="50%"
      mx="auto"
      p={3}
      borderRadius="12px"
      boxShadow="0 4px 8px rgba(0,0,0,0.1)"
      bgcolor="#fff"
    >
      <Typography variant="h5" fontWeight="700" gutterBottom>
        Scrap Business Info
      </Typography>

      <Box display="flex" flexDirection="column" gap={3} width="100%">
        <Box display="flex" flexDirection="row" alignItems="center">
          <Typography variant="subtitle1" sx={{ marginRight: 2 }}>
            Select Items:
          </Typography>
          <Select
            value={rangeOptions.find((option) => option.value === range)}
            onChange={(selectedOption) => setRange(selectedOption.value)}
            options={rangeOptions}
            styles={{
              container: (provided) => ({
                ...provided,
                width: "200px",
                marginBottom: "10px",
              }),
            }}
          />
        </Box>

        

        <Box display="flex" flexDirection="row" alignItems="center">
          <Typography variant="subtitle1" sx={{ marginRight: 2 }}>
            Select Delay:
          </Typography>
          <Select
            value={delayOptions.find((option) => option.value === delay)}
            onChange={(selectedOption) => setDelay(selectedOption.value)}
            options={delayOptions}
            styles={{
              container: (provided) => ({
                ...provided,
                width: "200px",
              }),
            }}
          />
        </Box>

        {!loading && (
          <Button
            onClick={fetchData}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: "8px",
              padding: "10px 20px",
              fontSize: "1rem",
            }}
          >
            Scrap {range} IDs
          </Button>
        )}

        {error && <Typography color="error">{error}</Typography>}

        {loading && (
          <Box>
            <CircularProgress />
          </Box>
        )}

        {data && data.length > 0 && (
          <Button
            onClick={() => setShow((prev) => !prev)}
            variant="outlined"
            color="primary"
            sx={{
              borderRadius: "8px",
              padding: "10px 20px",
              fontSize: "1rem",
              marginTop: 2,
            }}
          >
            {show ? "Hide Results" : "Show Results"}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ScrapBusinessInfo;

export const generateOptions = (start, end, step, labelSuffix = "") => {
  const options = [];
  for (let i = start; i <= end; i += step) {
    options.push({ value: i, label: `${i} ${labelSuffix}` });
  }
  return options;
};
