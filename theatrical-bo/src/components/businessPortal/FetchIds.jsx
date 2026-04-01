import React, { useState } from "react";
import axios from "axios";
import { CircularProgress, Box, Button, Typography } from "@mui/material";
import IdSearch from "./IdSearch";

export const backend_url = "http://localhost:1000";

const FetchIds = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showData, setShowData] = useState(false);

  const fetchIds = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backend_url}/businessportal/ids`);
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredIds = data?.filter(({ id }) =>
    id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDataVisibility = () => {
    if (!data) {
      fetchIds();
    }
    setShowData((prev) => !prev);
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
        Fetch IDs
      </Typography>

      <Button
        onClick={toggleDataVisibility}
        variant="contained"
        color="primary"
        sx={{
          borderRadius: "8px",
          padding: "10px 20px",
          fontSize: "1rem",
          marginBottom: 3,
        }}
      >
        {showData ? "Hide Ids" : "Show Ids"}
      </Button>

      {showData && filteredIds && (
        <Box width="100%">
          {filteredIds && filteredIds.length > 0 && (
            <IdSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filteredIds={filteredIds}
            />
          )}
        </Box>
      )}

      {loading && (
        <Box mt={2}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" mt={2}>
          Error: {error}
        </Typography>
      )}
    </Box>
  );
};

export default FetchIds;
