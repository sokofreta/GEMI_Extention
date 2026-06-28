import "./Register.css"

import axios from "axios";
import { useState } from "react"
import Footer from "../Footer/Footer"
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";


const RegisterPage = () => {

    const NAVIGATE = useNavigate()
    //Keep track of the user input.
    const [Username, SetUsername] = useState('');
    const [FirstPassword, SetFirstPassword] = useState('');
    const [SecondPassword, SetSecondPassword] = useState('')
    const [Lastname, SetLastname] = useState("")
    const [Email, SetEmail] = useState("")

    //form response from use input.
    const [FormResponse, SetFormResponse] = useState("")




    const SubmitHandler = (e) => {
        e.preventDefault()
        SetFormResponse("")
        if (Username === "" || FirstPassword === "") {
            console.log("please fill the form")
            SetFormResponse("Something went wrong")
            return
        }

        if (FirstPassword !== SecondPassword) {
            console.log("Passwords not the same")
            SetFormResponse("Passwords is not the same. \nTry again!")
            return
        }

        // Send user data to server.

        //First construct a User object
        const User = { Username, FirstPassword, Lastname, Email };

        //call API to create a user.   

        axios.post(`http://localhost:1000/Users`, User,
            {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            }
        ).catch((err) => {
            console.log(err)
        })

    }

    return (<>
        <div className="RegisterContainer">
            <Navbar />


            <div className="RegisterFormCon">
                <form onSubmit={SubmitHandler} className="RegisterForm">

                    <div className="RegisterItemCon">
                        <input type="text"
                            className="RegisterItem"
                            placeholder="Enter Username"
                            name="Username"
                            onChange={(e) => { SetUsername(e.target.value) }} />

                        <input type="text"
                            className="RegisterItem"
                            placeholder="Enter Lastname"
                            name="Lastname"
                            onChange={(e) => { SetLastname(e.target.value) }} />

                        <input type="password"
                            className="RegisterItem"
                            placeholder="Enter Password"
                            name="FirstPassword"
                            onChange={(e) => { SetFirstPassword(e.target.value) }} />

                        <input type="password"
                            className="RegisterItem"
                            placeholder="Re-Enter Password"
                            name="SecondPassword"
                            onChange={(e) => { SetSecondPassword(e.target.value) }} />

                        <input type="text"
                            className="RegisterItem"
                            placeholder="Email "
                            name="Username"
                            onChange={(e) => { SetEmail(e.target.value) }} />
                    </div>


                    <button type="Submit" className="RegisterFormSubmitBtn">
                        Submit
                    </button>
                </form>

                <div className="RegisterFormResponse">
                    <span>{FormResponse}</span>
                </div>

                 <p className="RegisterRedirect" onClick={() => { NAVIGATE("/Login") }}>Already have account? Signup here!</p>
            </div>



            
           
        </div>
    </>
    )
}

export default RegisterPage