import {useState,useEffect} from 'react';
import axios from 'axios';

const BusinessCard = ({Data})=>{

        const [Binfo,SetBinfo] = useState()

        //Getting Business infomations from DB 
        const BusinessData = async() => {   
            const response = await axios.get(`http://localhost:1000/businessportal/businessid`,{
                params :{
                    id : Data
                }})            
            SetBinfo(response.data[0])
            }
        
            //Fetch data from DB once
        useEffect(()=>{
            BusinessData()
        },[])
 

        // Display Business information 
        return (<div className="BusinessCard">
            <h1>Here we go again</h1>
            {(Binfo && (
                <>
                <span> {Binfo.companyNumber}</span>
                </>
            ))}
        </div>)
    }

export default BusinessCard