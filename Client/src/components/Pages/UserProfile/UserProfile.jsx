import { useState,useEffect } from "react"
import axios from "axios"

import "./UserProfile.css"
import { TextField } from "@mui/material"


const UserProfile = () => {

    const [OldUsername,SetOldUsername] = useState('Sokratis') 

    const [Username,SetUsername] = useState("")
    const [Lastname,SetLastname] = useState("")
    const [Password,SetPassword] = useState("")
    //const [ProfileImage,SetProfileImage] = useState("")

    //Pre-load User info.
    const GetUserData = (Username)=>{

        //API call to get specific user infomation.
        axios.get(`http://localhost:1000/Users/${Username}`)
        .then((results) =>{
            SetUsername(results.data.Username)
            SetLastname(results.data.Lastname)
        })
        .catch((err)=>{console.log(err)})
    }

    const HandleProfileSubmit = (e)=>{
        e.preventDefault()

        //If there is no password do not call API.
        if(Password=== "") {
           return
        }
        axios.post(`http://localhost:1000/Users/${OldUsername}`,{Username , Password ,Lastname})
    }

    //Actions that need to be made when the site mount.
    useEffect(()=>{
        
        //pre-load User info and
        GetUserData("Sokratis")
    },[])

    return (
        <div className="ProfilePageCon">
            {/* Preview of User profile */}
            <div className="LeftPanel">

                {/* User picture and presentaction   */}
                <div className="LeftPanelCon">
                    <div className="UserInfoCon">
                        <img src={Image} alt="User" />
                        <span>{Username}</span>
                    </div>

                </div>

            </div>

            {/* Changes that use can do */}
            <div className="MainPanel">
                {/* fields that user can change */}

                <form onSubmit={HandleProfileSubmit} className="ProfileFields">
                    <div className="Field" >
                        {}
                        <TextField required placeholder="Username" name="Username"
                            onChange={(e) => SetUsername(e.target.value)}
                            value={Username} />
                    </div>

                    <div className="Field" required name="Password">
                        <TextField placeholder="Password"
                            onChange={(e) => SetPassword(e.target.value)} />
                    </div>

                    <div className="Field">
                        <TextField placeholder="Lastname" name="Lastname"
                            onChange={(e) => SetLastname(e.target.value,)}
                            value={Lastname} />
                    </div>


                    {/* image that user want to have */}
                    <div className="Field">
                        <TextField placeholder="Image" name="Image"
                            // onChange={(e) => SetProfileImage(e.target.value)} 
                            />
                    </div>

                    <button type="submit">Submit</button>
                </form>
            </div>



        </div>
    )
}


export default UserProfile