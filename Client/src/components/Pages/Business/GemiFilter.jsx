import { TextField, FormControl, Select, MenuItem } from "@mui/material"
import "./GemiFilter.css"
import { useEffect, useState } from "react"

// Fixed filters. May it is a good idea to not be here and inside a .env file 
// or indide a db table and when application starts just take from DB
// for protection and then imported here. 
const BusinesStatuses = [
    "Ενεργή",
    "Ανενεργή",
    "Αδρανής",
    "Πτώχευση"
]

const LegalForms = [
    "IKE",
    "MON",
    "OE",
    "AE",
]

const KADList = [
    4000,
    3000,
    4444
]

const RegionList = [

]

const GemiFilter = ({ Filters }) => {

    const AllFilters = () => {
        Filters({ Status: FilterStatus, LegalForm: FilterLegalform, KAD: FilterKAD })
    }

    const [FilterStatus, SetFilterStatus] = useState([BusinesStatuses[0]])
    const handleStatusChange = (e) => {
        SetFilterStatus(e.target.value)
    }

    const [FilterLegalform, SetFilterLegalform] = useState([LegalForms[0]])
    const handleLegalChange = (e) => {
        SetFilterLegalform(e.target.value)
    }

    const [FilterKAD, SetFilterKAD] = useState([KADList[0]])
    const handleKADChange = (e) => {
        SetFilterKAD(e.target.value)
    }

    useEffect(() => {
        AllFilters()
    }, [FilterLegalform, FilterStatus, FilterKAD])


    return (<>
        <div className="FiltersContainer">

            {/* Postal code filter */}
            <div className="Filter">
                <label>Ταχυδρομικός κώδικας</label>
                <TextField
                    placeholder="ΤΚ" />
            </div>

            {/* Region filter */}
            <div className="Filter">
                <label>Περιοχή</label>
                <TextField
                    placeholder="Περιοχή" />
            </div>

            {/* KAD filter */}
            <div className="Filter">
                <FormControl>
                    <label>ΚΑΔ</label>
                    <Select
                        multiple
                        value={FilterKAD}
                        onChange={handleKADChange}
                    >
                        {KADList.map((kad) => (
                            <MenuItem value={kad}> {kad} </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            {/* Status filter */}
            <div className="Filter">
                <FormControl>
                    <label>Κατάσταση</label>
                    <Select
                        required
                        multiple
                        value={FilterStatus}
                        onChange={handleStatusChange}
                    >
                        {BusinesStatuses.map((status) => (
                            <MenuItem value={status}> {status} </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>


            {/* Phonenumber Filter */}
            <div className="Filter">
                <label>Τηλέφωνο επικοινωνίας</label>
                <TextField
                    placeholder="Τηλέφωνο επικοινωνίας" />
            </div>

            {/* Legal form Filter */}
            <div className="Filter">

                <label>Νομική μορφή</label>
                <Select
                    required
                    multiple
                    value={FilterLegalform}
                    onChange={handleLegalChange}
                >
                    {LegalForms.map((form) => (
                        <MenuItem value={form}> {form} </MenuItem>
                    ))}
                </Select>
            </div>

            {/* Company name filter */}
            <div className="Filter">
                <label>Πλήρες όνομα</label>
                <TextField
                    placeholder="Όνομα" />
            </div>


            {/* Start range Filter */}
            <div className="Filter">
                <label>Αναζήτηση απο</label>
                <TextField
                    placeholder="ΗΗ/ΜΜ/ΧΧΧΧ" />
            </div>

            {/* End range Filter */}
            <div className="Filter">
                <label>Αναζήτηση μέχρι</label>
                <TextField
                    placeholder="ΗΗ/ΜΜ/ΧΧΧΧ" />
            </div>

            {/* Company number Filter */}
            <div className="Filter">
                <label>Κωδικός εταιρίας</label>
                <TextField
                    placeholder="Κωδικός" />
            </div>


        </div>
    </>)
}
export default GemiFilter


