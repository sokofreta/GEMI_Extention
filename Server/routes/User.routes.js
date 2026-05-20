import { Router } from "express";
import { MysqlConnection } from "../connections/Mysql.connection.js";

const Userrouter = Router();

Userrouter.get("/" , async (req,res)=> {
    MysqlConnection.query(`Select * from Users`,(err,result)=>{
        if (err) throw new Error(err)

        res.send( "First Name of user with id "+ result[0].id + " is " 
             + result[0].FirstName + " and last name is " + result[0].LastName)
        res.end();

    })
})

Userrouter.post("/" ,async (req,res)=>{
    const User = {}
        MysqlConnection.query(`insert into Users (Firstname ,Lastname) Values (?)`,
        [[req.body.Username,req.body.FirstPassword]],(err,result) =>{
            if (err) {
                res.send(String(err.errno))
            }

            res.send(result)
            res.end()
        })
})


export const UsersRoutes = Userrouter