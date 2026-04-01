import React from "react";

const IdSearch = ({ searchTerm, setSearchTerm, filteredIds }) => {
  console.log("filteredIds", filteredIds);

  return (
    <div className="id-search" style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center" }}>
      <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
        <input type="text" placeholder="Search by ID" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {filteredIds && filteredIds.length > 0 && (
        <div className="table-container">
          <h2>IDs List</h2>
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>%</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredIds.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td style={{ color: item.percetage > 49 ? "green" : "red" }}>
                    {item.percetage}%
                  </td>
                  <td>{item.scraped ? "Scraped" : "Not Scraped"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!filteredIds || filteredIds.length === 0 && <p>No results found.</p>}
    </div>
  );
};

export default IdSearch;
