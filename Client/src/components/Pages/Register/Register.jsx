import "./Register.css"

import axios from "axios";
import { useState } from "react"


const RegisterPage = () => {

    //Keep track of the user input.
    const [Username, SetUsername] = useState('');
    const [FirstPassword,SetFirstPassword] = useState('');
    const [SecondPassword,SetSecondPassword] = useState('')
   
    //Variable related to the style of the account creation form.
    const [StyleStage,SetStyleStage] = useState("normal")



    const SubmitHandler = (e) => {
        e.preventDefault()
        if (Username === "" || FirstPassword === "" || (FirstPassword !== SecondPassword))
        {
            console.log("please fill the form")
            SetStyleStage("error")
            return
        }
        
        // Send user data to server.

        //First construct a User object
        const User = { Username, FirstPassword };

        //call API to create a user.   
        {axios.post(`http://localhost:1000/Users`,User,
            {headers:{
                'Access-Control-Allow-Origin' : '*'
            }}
            )
            .then((results)=>{
                HandleResponse(results.data.Usercode)
            })
            .catch((err) =>{
                console.log(err)
            })}
    }

    const HandleResponse = (Usercode)=>{

        //Chage HTML elements style to notify the user about their actions
        if(Usercode === 1) {SetStyleStage("success")}
        if(Usercode === 0) {SetStyleStage("error")}
    }

    return (
        <div className="PageContainer">

            <form onSubmit={SubmitHandler}>
                <input type="text"
                    className={StyleStage + " Username"}
                    placeholder="Enter Username"
                    name="Username"
                    onChange={(e)=>{SetUsername(e.target.value)}} />

                <input type="password" 
                    className={StyleStage + " FirstPassword" }
                    placeholder="Enter Password"
                    name="FirstPassword"
                    onChange={(e)=>{SetFirstPassword(e.target.value)}} />

                <input type="password" 
                    className={StyleStage + " SecondPassword"} 
                    placeholder="Re-Enter Password" 
                    name="SecondPassword"
                    onChange={(e)=>{SetSecondPassword(e.target.value)}} />


                <input type="submit" className={StyleStage} />
            </form>

        </div>
    )
}

export default RegisterPage