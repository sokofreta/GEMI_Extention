import axios from "axios";
import { useState, useEffect, Suspense } from "react";
import "./Businesses.css"
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import GemiFilter from "./GemiFilter";
import BusinessPages from "./BusinessPages";
import { TextField } from '@mui/material'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';

const Businesses = () => {
    const [businessidsdata, SetBusinessidsdata] = useState([])
    const [SearchText, SetSearchText] = useState('');
    const [isLoading, setisLoading] = useState(true)
    const [isScraped, SetScraped] = useState(true)

    const [Filters, SetFilters] = useState({})
    const BusinessIds = async () => {
        await axios.get("http://localhost:1000/businessportal/ids")
            .then((res) => {
                setisLoading(true)
                setTimeout(() => { SetBusinessidsdata(res.data); setisLoading(false) }, 3000)
            })


    }

    useEffect(() => {
        BusinessIds()
    }, [])

    useEffect(() => {
        console.log(Filters)
    }, [Filters])

    //Handle Filters (Open and Close)
    const [FilterActivation, SetFilterActivation] = useState(false)
    const isFilteractive = () => {
        SetFilterActivation(!FilterActivation)
    }


    const Search = () => {
        //Do the search logic here.
        console.log("Serach Text.... " + (SearchText ? SearchText : "nothing to see here"))
        console.log("Filters...." + Filters)
    }



    return (
        <>
            {/* <BusinessCard Data={businessidsdata} /> */}


            <Navbar />
            <div className="BusinesContainer">
                <div className="BusinessPage">
                    <h1>Καλώς ορίσατε στις επιχειρήσεις</h1>
                    <p>Εδώ θα βρείς οτι πληροφορία χρειάζεσαι!</p>
                    <div className="SearchInput">
                        <TextField className="SearchText"
                            onChange={(e) => SetSearchText(e.target.value)}
                            placeholder="Αναζήτηση" />
                        <button className="SearchIcon" onClick={isFilteractive}>
                            <FontAwesomeIcon icon={faFilter} size='2xl' />
                        </button>
                        <button className="SearchIcon" onClick={Search}>
                            <FontAwesomeIcon icon={faSearch} size='2xl' />
                        </button>

                    </div>


                    {/*Show filters only when user click on them*/}
                    {FilterActivation ? <GemiFilter Filters={SetFilters} /> : <></>}


                    {/* //#region Busines pages */}

                    {/* //#endregion  */}
                    {/* Load only the first 5 bussiness */}
                    <div className="BussinesViewport">
                        {/* Extract this into a compoment */}
                        <div className="BusinessPages">
                            <BusinessPages Businesses={businessidsdata.slice(0, 5)}
                                Filters={Filters} />

                            {isLoading ? <></> : <h1>PAGES!</h1>}

                        </div>
                    </div>
                    {/*
                    {isLoading ? <h1>Wait for business to load...</h1>
                        : <div className="BussinesViewport">
                            <div className="BusinessDisplay">
                                {businessidsdata.map((Busines, index) => {
                                    return (
                                        <>
                                            {/* Render bussines info only if there is data for it}
                                            {Busines.scraped
                                                ? <><BusinessCard Bid={Busines.id} key={Busines.id} />
                                                    <p className="Seperator"></p></>
                                                : <></>}
                                        </>)
                                })}
                            </div>
                        </div>} */}

                </div>
            </div>



            <Footer />
        </>
    )
}

export default Businesses