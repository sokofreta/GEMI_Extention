import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import "./Businesses.css"
import BusinessCard from "./BusinessCard"
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import {TextField} from '@mui/material'
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

    return (
        <>
        {/* <BusinessCard Data={businessidsdata} /> */}

        <Header/>
        <Navbar/>
        <div className="PageContainer">
            <div className="BusinessPage">
                <h1>Welcome to Businesses</h1>
                <p>Here you should find everything about Businesses</p>
                <div className="SearchInput">
                    <TextField fullWidth/>
                </div>
                
                
                <div className="BussinesViewport">
                    <div className="BusinessDisplay">
                    {businessidsdata.map((Busines) =>{
                        
                    return(<BusinessCard Data={Busines.id} key={Busines.id}/>)
                    })} 
                    </div>   
                </div>
            </div>
        </div>

        <Footer/>
        </>
        )
}

export default Business