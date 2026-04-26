import axios from "axios";
import { useEffect, useState } from 'react'


function Business () {

    const [businesses, setBusinesses] = useState([])

    const businessCard = ({bid}) => {

        return(<>
            <h2>Id of Business is {bid}</h2>
        </>)
    }
    
    const getBusinessesData = () => {
        axios.get("http://localhost:1000/businessportal/ids") 
        .then((res)=> {
            setBusinesses(res.data)
            //console.log(res.data)
        })
    }

    useEffect(()=> {
        getBusinessesData()
    },[])


    return<>
        <p> {businesses.map((busina) => (
            <businessCard bid={busina.id}/>
        ))}</p>
    </>
}

export default Business;


