import { useState, useEffect } from 'react';
import axios from 'axios';
import "./BusinessCard.css"
import { useNavigate } from 'react-router-dom';

const BusinessCard = ({ Bid }) => {
    const Navigate = useNavigate()
    const [Binfo, SetBinfo] = useState()

    //Getting Business infomations from DB 
    const BusinessData = async () => {
        const response = await axios.get(`http://localhost:1000/businessportal/businessid`, {
            params: {
                id: Bid
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
            {Binfo ? <div className="BusinessCard"
                onClick={() => { Navigate(`/Business/${Binfo.companyNumber}`, { state: { Binfo: Binfo } }) }} >
                <h3>{Binfo.fullName}</h3>
                <div className='BusinessShortInfo'>
                    <p className='ShortInfo'>
                        <span>Αριθμός ΓΕΜΗ</span>
                        {Binfo.companyNumber}
                    </p>
                    <p className='ShortInfo'>
                        <span>ΑΦΜ</span>
                        {Binfo.vatNumber}
                    </p>
                    <p className='ShortInfo'>
                        <span>Κατάσταση</span>
                        {Binfo.status}
                    </p>
                    <p className='ShortInfo'>
                        <span>Νομική Μορφή</span>
                        {Binfo.legalForm}
                    </p>
                </div>
            </div>
                : <></>}


        </>)
}
// Display Business information 

export default BusinessCard