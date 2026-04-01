import React from 'react';

const DataDisplay = ({ data }) => {
  return (
    <div className="data-display" style={{width:"400px",display:"flex",height:600,overflow:"auto"}}>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default DataDisplay;
