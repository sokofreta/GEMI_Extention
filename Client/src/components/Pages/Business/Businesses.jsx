import axios from "axios";
import { useState, useEffect, Suspense } from "react";
import "./Businesses.css"
import BusinessCard from "./BusinessCard"
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { TextField } from '@mui/material'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const Business = () => {
    const [businessidsdata, SetBusinessidsdata] = useState([])
    const [SearchText, SetSearchText] = useState('');

    const BusinessIds = async () => {
        await axios.get("http://localhost:1000/businessportal/ids")
            .then((res) => {
                SetBusinessidsdata(res.data)
            })


    }

    useEffect(() => {
        BusinessIds()
    }, [])

    //Handle Filters (Open and Close)
    const [FilterActivation, SetFilterActivation] = useState(false)
    const Filters = () => {
        SetFilterActivation(!FilterActivation)
    }


    //Filters init
    const [KAD, SetKAD] = useState("")
    const [Region, SetRegion] = useState("")
    const [PostCode, SetPostCode] = useState("")


    return (
        <>
            {/* <BusinessCard Data={businessidsdata} /> */}

            <Header />
            <Navbar />
            <div className="PageContainer">
                <div className="BusinessPage">
                    <h1>Καλώς ορίσατε στις επιχειρήσεις</h1>
                    <p>Εδώ θα βρείς οτι πληροφορία χρειάζεσαι!</p>
                    <div className="SearchInput">
                        <TextField className="SearchText"
                            onChange={(e) => SetSearchText(e.target.value)}
                            placeholder="Αναζήτηση" />
                        <button className="SearchIcon" onClick={Filters}>
                            <FontAwesomeIcon icon={faFilter} size='2xl' />

                        </button>

                    </div>


                    {/*Show filters only when user click on them*/}
                    {FilterActivation && (<>
                        <div className="FiltersContainer">
                            <div className="Filter">
                                <label>ΤΑΧΥΔΡΟΜΙΚΟΣ ΚΩΔΙΚΑΣ</label>
                                <TextField onChange={(e) => SetPostCode(e.target.value)}
                                    placeholder="ΤΚ:" />
                            </div>

                            <div className="Filter">
                                <label>ΠΕΡΙΟΧΗ</label>
                                <TextField onChange={(e) => SetRegion(e.target.value)}
                                    placeholder="Περιοχή" />
                            </div>

                            <div className="Filter">
                                <label>ΚΑΔ</label>
                                <TextField onChange={(e) => SetKAD(e.target.value)}
                                    placeholder="ΚΑΔ" />
                            </div>
                        </div>
                    </>)}

                    <Suspense fallback={<h1>Wait for business to load...</h1>}>
                        <div className="BussinesViewport">
                            <div className="BusinessDisplay">
                                {businessidsdata.map((Busines) => {
                                    {setTimeout(() => {
                                         
                                    }, 2000);}
                                    return (<BusinessCard Data={Busines.id} key={Busines.id} />)
                                })}
                            </div>
                        </div>
                    </Suspense>

                </div>
            </div>

            <Footer />
        </>
    )
}

export default Business