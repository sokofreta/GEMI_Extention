import { Router } from "express";
import { MysqlConnection } from "../connections/Mysql.connection.js";
import {hash, compare} from "bcrypt"

const Userrouter = Router();

Userrouter.get("/" , async (req,res)=> {
    MysqlConnection.query(`Select * from Users`,(err,result)=>{
        if (err) throw new Error(err)

        res.send( "First Name of user with id "+ result[0].id + " is " 
             + result[0].FirstName + " and last name is " + result[0].LastName)
        res.end();

    })
})

Userrouter.get("/:Username" , async (req,res)=>{
    const { Username } = req.params
    MysqlConnection.query(`Select * from Users where FirstName=?`,
        [Username],(err,result)=>{
        //Handle errors
        if(err) throw new Error(err)
        
        res.send(result[0])
        res.end()  
    })
})

Userrouter.post("/login", async (req,res)=>{
    const {Username,Password} = req.body
    MysqlConnection.query(`Select Firstname,Userid from Users where FirstName="${Username}" and UserPassword=${Password}`
        ,(err,result)=>{
            if(err) {
                res.send("Something went wrong")
                return
            }

            //User not found in DataBase
            if(result[0] === undefined)
            {
                res.send({Usercode : 0 ,message:"User not in DB"})
                return
            }
            res.send({userinfo:result[0],Usercode:1,message:"User successfully login"})
            res.end()
        })
})

Userrouter.post("/" ,async (req,res)=>{
        const password = req.body.FirstPassword
        hash(password, 10, function (err, hashedPassword) {
            if (err) {
                console.error(err);
                return;
            }
            console.log(hashedPassword)
            MysqlConnection.query(`insert into Users (Firstname ,UserPassword) Values (?)`,
                [[req.body.Username,String(hashedPassword)]],(err,result) =>{
                    if (err) {
                        res.send({message:"Error during creation" , Usercode:0})
                        return
                    }

                    res.send({message:"New User created", Usercode : 1})
                    res.end()
                })
        });
        
})


export const UsersRoutes = Userrouter