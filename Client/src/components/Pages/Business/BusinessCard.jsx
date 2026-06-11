import { useState, useEffect } from 'react';
import axios from 'axios';
import "./BusinessCard.css"

const BusinessCard = ({ Data }) => {

    const [Binfo, SetBinfo] = useState()

    //Getting Business infomations from DB 
    const BusinessData = async () => {
        const response = await axios.get(`http://localhost:1000/businessportal/businessid`, {
            params: {
                id: Data
            }
        })
        SetBinfo(response.data[0])
    }

    //Fetch data from DB once
    useEffect(() => {
        BusinessData()
    }, [])


    return (
        <>
            {Binfo &&
                (<div className="BusinessCard">
                    <h2>{Binfo.fullName}</h2>
                    <span> {Binfo.companyNumber}</span>
                </div>)}
        </>)
}
// Display Business information 

export default BusinessCard