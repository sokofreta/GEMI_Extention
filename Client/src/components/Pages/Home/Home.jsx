import React, { useState } from "react";
import "./Home.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer"

const dataRegions = [
  {subRegions : [{
    name: "Δυτική Ελλάδα",
    subRegions: [
      { name: "Sindos", subRegions: [] },
      { name: "Diavata", subRegions: [] },
      { name: "Magnisia", subRegions: [] },
    ],
  },

  {
    name: "Δυτική Μακεδονία",
    subRegions: [
      { name: "Methana", subRegions: [{ name: "oinofyta" }] },
      { name: "Aspropyrgos", subRegions: [] },
      { name: "Siteia", subRegions: [] },
    ],
  }]}
];

function Region({ region }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li key={region.name}>
      <span>
        {region.subRegions && region.subRegions.length > 0 && (
          <>
          <button className="Expandor" onClick={() => setIsOpen(!isOpen)}>
            {/* Expaned Icon */}
          </button>
          <button  className="Selector" onClick={() => handleRegions(region.name)}>
            {/* Expaned Icon */}
          </button></>
        )}
        {region.name}
      </span>

      {isOpen && (
        <ul>
          {region.subRegions?.map((region) => (
            <Region region={region} key={region.name} />
          ))}
        </ul>
      )}
    </li>
  );
}

const handleRegions = (name) =>{
  console.log(name)
}

const Home = () => {
  return (<>
    <div className="PageContainer"> 
        <div className="ListOfRegions">
            <ul>
              {dataRegions.map((region) => (
              <Region region={region} key={region.name} />
              ))}
            </ul>
    </div>
    </div>
    
      <Footer/>
    <Navbar/>

    </>
  );
};
export default Home;
