import axios from "axios"
import "./Login.css"
import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { TextField } from "@mui/material"
import { blue } from "@mui/material/colors"

const LoginPage = () => {


    const [Password, SetPassword] = useState("")
    const [Username, SetUsername] = useState("")

    //Variable related to the style of the account creation form.
    const [StyleStage, SetStyleStage] = useState("normal")

    const [FormResponse,SetFormResponse] = useState("")

    const NAVIGATE = useNavigate()

    const HandleSubmit = (e) => {
        e.preventDefault()

        if (!(Username && Password)) {
            SetFormResponse("Please enter all gredencials to continue")
            console.log("Please enter all gredencials to continue")
            return
        }
        //console.log("Trying to connect to http://db:1000/Users/login....")
        axios.post(`http://localhost:1000/Users/login`, { Username, Password })
            .then((response) => {
                const res = response.data
                const Userinfo = res.userinfo
                const Usercode = res.Usercode


                if (Usercode !== 1) {
                    SetFormResponse("Congrats you failed!")
                    SetStyleStage("error")
                    return
                }

                console.log(Userinfo)
                SetFormResponse("You can continue now")
                SetStyleStage("success")

                //User in login Transfer to main page.
                NAVIGATE("/")
            })
            .catch((err) => console.log(err))
    }

    return (
        <div className="LoginContainer">

            <div className="FormCon">
                <form onSubmit={HandleSubmit} className="Form">
                    <TextField className={StyleStage}
                        sx={{ mb: 1.5, bgcolor: blue }}
                        label="Username"
                        size="small"
                        placeholder="Enter Username..."
                        onChange={(e) => SetUsername(e.target.value)}
                    />
                    <TextField className={StyleStage}
                        sx={{ mb: 1.5 }}
                        type="password"
                        label="Password"
                        size="small"
                        placeholder="Enter password..."
                        onChange={(e) => SetPassword(e.target.value)} />

                    <button className="LoginItem FormSubmitBtn" type="Submit"> submit</button>
                </form>

                <div className="FormResponse">
                        <span>{FormResponse}</span>
                </div>
            </div>



        </div>
    )
}



export default LoginPage 