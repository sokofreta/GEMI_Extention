import "./Register.css"

import axios from "axios";
import { useState } from "react"
import Footer from "../Footer/Footer"
import Navbar from "../Navbar/Navbar";


const RegisterPage = () => {

    //Keep track of the user input.
    const [Username, SetUsername] = useState('');
    const [FirstPassword, SetFirstPassword] = useState('');
    const [SecondPassword, SetSecondPassword] = useState('')
    const [Lastname, SetLastname] = useState("")

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
        const User = { Username, FirstPassword, Lastname };

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
        <Navbar/>
        <Footer/>
        <div className="RegisterContainer">
            <div className="FormCon">
                <form onSubmit={SubmitHandler} className="Form">
                    <div className="FormSegment">
                        <input type="text"
                            className="RegItem"
                            placeholder="Enter Username"
                            name="Username"
                            onChange={(e) => { SetUsername(e.target.value) }} />

                        <input type="text"
                            className="RegItem"
                            placeholder="Enter Lastname"
                            name="Lastname"
                            onChange={(e) => { SetLastname(e.target.value) }} />
                    </div>

                    <div className="FormSegment">
                        <input type="password"
                            className="RegItem"
                            placeholder="Enter Password"
                            name="FirstPassword"
                            onChange={(e) => { SetFirstPassword(e.target.value) }} />

                        <input type="password"
                            className="RegItem"
                            placeholder="Re-Enter Password"
                            name="SecondPassword"
                            onChange={(e) => { SetSecondPassword(e.target.value) }} />
                    </div>

                    <button type="Submit" className="FormSubmitBtn">
                        Submit
                    </button>
                </form>

                <div className="FormResponse">
                    <span>{FormResponse}</span>
                </div>
            </div>

        </div>
          </>
    )
}

export default RegisterPage