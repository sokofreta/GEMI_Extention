import { useLocation } from "react-router-dom";

const Business = () => {

    const location = useLocation()
    const Binfo = location.state.Binfo

    return (
        <>
            <br />{Binfo.companyNumber}
            <br />{Binfo.address}
            <br />{Binfo.createdAt}
            <br />{Binfo.email}
            <br />{Binfo.fullName}
            <br />{Binfo.kad} {/* Κυριο ΚΑΔ*/}
            <br />{Binfo.kad_details} {/*Λεπτομεριες του κυριου ΚΑΔ */}
            <br />{Binfo.legalForm}
            <br />{Binfo.phoneNumber}
            <br />{Binfo.purpose}  {/*Εχει ολα τα ΚΑΔ και την περιγραφη τους */}
            <br />{Binfo.status}
            <br />{Binfo.vatNumber} {/* AFM */}

            {console.log(Binfo)}
            <h1>{Binfo.fullName}</h1>


            {/* KAD section */}
            <h4>Κωδικός ΚΑΔ <br />{Binfo.kad}</h4>
            <h4>Περιγραφή ΚΑΔ <br />{Binfo.kad_details}</h4>

            <a href={Binfo.address}> CLICK ME!!!</a>
        </>
    )
}


export default Business