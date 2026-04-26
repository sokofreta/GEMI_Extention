import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import "./Businesses.css"

const Business = () => {
    const [businessidsdata,SetBusinessidsdata] = useState([])
    
    const BusinessIds = () =>{
    axios.get("http://localhost:1000/businessportal/ids")
    .then((res) => {
        SetBusinessidsdata(res.data)
    })
}
    
useEffect(() => {
    BusinessIds()
},[])
    
    const BusinessCard = (props)=>{

        const [Binfo,SetBinfo] = useState()

        useEffect(() =>{axios.get(`http://localhost:1000/businessportal/businessid`,{
            params :{
                id : props.Bid.id
            }
            
        }).then((res)=>{
            SetBinfo(res.data[0])})}
            ,[])

        return <div className="BusinessCard">
            {console.log(Binfo.companyNumber)}
        </div>
    }
    
    return <>
        {businessidsdata.map((Bid) =>(
            <>
            <BusinessCard Bid={Bid}/>
            </>
        ))}
        <h1> Welcome to Business</h1>
        <p>Here you should find every thing about open Businesses</p>
        
    </>
}

export default Business