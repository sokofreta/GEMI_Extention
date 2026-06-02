import  axios from "axios"
import "./Login.css"
import { useState } from "react"
import {useNavigate} from 'react-router-dom'


const LoginPage = () => {


    const [Password,SetPassword] = useState("")
    const [Username,SetUsername] = useState("")

    //Variable related to the style of the account creation form.
    const [StyleStage,SetStyleStage] = useState("normal")



    const NAVIGATE = useNavigate()
    
    const HandleSubmit = (e) =>{
        e.preventDefault()

        if(!(Username && Password)){
            console.log("Please enter all gredencials to continue")
            return
        }

        axios.post(`http://localhost:1000/Users/login`, {Username ,Password })
        .then((response) => {
            const res = response.data
            const Userinfo= res.userinfo
            const Usercode = res.Usercode


            if(Usercode !== 1){
                SetStyleStage("error")
                return
            }

            console.log(Userinfo)

            SetStyleStage("success")

            //User in login Transfer to main page.
            NAVIGATE("/")
        })
        .catch((err) => console.log(err))
    }

    return (
        <div className="PageContainer">

            <form onSubmit={HandleSubmit}>
                <input type="text" className={StyleStage} 
                    placeholder="Enter Username..."
                    onChange={(e)=> SetUsername(e.target.value)}
                    />
                <input type="password" className={StyleStage}
                    placeholder="Enter password..."
                    onChange={(e)=> SetPassword(e.target.value)}/>

                <input type="Submit" className={StyleStage}></input>
            </form>
            



        </div>
    )
}



export default LoginPage 