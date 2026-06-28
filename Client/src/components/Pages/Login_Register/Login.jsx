import axios from "axios"
import "./Login.css"
import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { TextField } from "@mui/material"
import Navbar from "../Navbar/Navbar"

const LoginPage = () => {

    const NAVIGATE = useNavigate()
    const [Password, SetPassword] = useState("")
    const [Username, SetUsername] = useState("")


    const [FormResponse, SetFormResponse] = useState("")



    const HandleSubmit = (e) => {
        e.preventDefault()

        if (!(Username && Password)) {
            SetFormResponse("Παρακαλώ συμπληρώστε τα στοιχεια σας")
            return
        }
        //console.log("Trying to connect to http://db:1000/Users/login....")
        axios.post(`http://localhost:1000/Users/login`, { Username, Password })
            .then((response) => {
                const res = response.data
                const Userinfo = res.userinfo
                const Usercode = res.Usercode


                if (Usercode !== 1) {
                    SetFormResponse("Μη έγκυρο όνομα χρήστη ή κωδικός πρόσβασης\nΔοκίμασε ξανά")
                    return
                }
                SetFormResponse("You can continue now")
                sessionStorage.setItem("Usersname", Username)

                //User in login Transfer to main page.
                NAVIGATE("/")
            })
            .catch((err) => console.log(err))
    }

    return (
        <div className="LoginContainer">
            <Navbar />
            <div className="LoginFormCon">
                <form onSubmit={HandleSubmit} className="LoginForm">
                    <input type="text"
                        className="LoginItem"
                        placeholder="Όναμα χρήστη"
                        name="Lastname"
                        onChange={(e) => { SetUsername(e.target.value) }} />

                    <input type="password"
                        className="LoginItem"
                        placeholder="Κωδικός πρόσβασης"
                        name="Lastname"
                        onChange={(e) => { SetPassword(e.target.value) }} />

                    <button className="LoginFormSubmitBtn" type="Submit"> submit</button>
                </form>

                <div className="LoginFormResponse">
                    {FormResponse}
                </div>
                <p className="LoginRedirect" onClick={() => { NAVIGATE("/Register") }}>
                Δεν έχεις λογαριασμό; {"\n"}Δημιούργησε τον εδώ!  </p>
            </div>

            

        </div>
    )
}



export default LoginPage 