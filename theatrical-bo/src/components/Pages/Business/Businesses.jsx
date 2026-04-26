import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import "./Businesses.css"
import BusinessCard from "./BusinessCard"

const Business = () => {
    const [businessidsdata,SetBusinessidsdata] = useState([])
    
    const BusinessIds = async () =>{
    await axios.get("http://localhost:1000/businessportal/ids")
    .then((res) => {
        SetBusinessidsdata(res.data)
    })

    
}
    
useEffect(() => {
    BusinessIds()},[])

    return (<>
        
        {/* <BusinessCard Data={businessidsdata} /> */}
        <h1> Welcome to Business</h1>
        <p>Here you should find every thing about open Businesses</p>
        <div>
            {businessidsdata.map((Busines) =>{
                
            return(<BusinessCard Data={Busines.id} key={Busines.id}/>)
        })}    
        </div>
         
        
    </>)
}

export default Business