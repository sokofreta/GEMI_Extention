import { Router } from "express";
import { MysqlConnection } from "../connections/Mysql.connection.js";
import { hash, compare } from "bcrypt"

const Userrouter = Router();

Userrouter.get("/", async (req, res) => {
    MysqlConnection.query("USE Users")
    MysqlConnection.query(`Select * from Users`, (err, result) => {
        if (err) throw new Error(err)

        res.send("First Name of user with id " + result[0].id + " is "
            + result[0].FirstName + " and last name is " + result[0].LastName)
        res.end();

    })
})

Userrouter.get("/:Username", async (req, res) => {
    const { Username } = req.params
    MysqlConnection.query("USE Users")
    MysqlConnection.query(`Select * from Users where fname=?`,
        [Username], (err, result) => {
            //Handle errors
            if (err) throw new Error(err)

            res.send(result[0])
            res.end()
        })
})

Userrouter.post("/login", async (req, res) => {
    const { Username, Password } = req.body
    MysqlConnection.query("USE Users")
    MysqlConnection.query(`Select pwd from Users where fname="${Username}"`,
        (err, passresults) => {
            if (passresults < 1) {
                res.send("User not in db")
                console.log("User not in db")
                return
            }

            if(err) {
                console.log(err)
                return
            }
            compare(Password, passresults[0].pwd, (err, authresult) => {

                if (err) {
                    // Handle error
                    console.error('Error comparing passwords:', err);
                    return;
                }
                if (authresult) {
                    // Passwords match, authentication successful
                    console.log('Passwords match! User authenticated.');
                    res.send({ Usercode: 1, message: "User successfully login" })
                    res.end()

                    //res.send({Usercode:1,message:"User successfully login"})
                } else {
                    // Passwords don't match, authentication failed
                    console.log('Passwords do not match! Authentication failed.');
                    res.send({ Usercode: 0, message: "User not in DB" })    
                    res.end()
                    //res.send({Usercode : 0 ,message:"User not in DB"})
                }
            })
        })
})

Userrouter.post("/", async (req, res) => {
    const password = req.body.FirstPassword
    hash(password, 10, function (err, hashedPassword) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(hashedPassword);
        MysqlConnection.query("USE Users")
        MysqlConnection.query(`insert into Users (fname ,lname,pwd) Values (?)`,
            [[req.body.Username,req.body.Lastname, String(hashedPassword)]], (err, result) => {
                if (err) {
                    console.log(err)
                    res.send({ message: "Error during creation", Usercode: 0 })
                    return
                }

                res.send({ message: "New User created", Usercode: 1 })
                res.end()
            })
    });

})

//Change User Information.
Userrouter.post("/:Username", async (req, res) => {
    const OldUsername = req.params.Username
    const { Username, Lastname, Password } = req.body
    hash(Password, 10, (err, hashedPassword) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Sending query....")
        MysqlConnection.query("USE Users")
        MysqlConnection.query(`UPDATE Users 
                            SET fname="${Username}", lname="${Lastname}",
                            pwd="${hashedPassword}"
                            Where fname="${OldUsername}"`, (err, results) => {
            console.log("Query send....")

            if (err) {
                res.send({ message: "Error during creation", Usercode: 0 })
                console.log(err)
                return
            }
            console.log("Awnser...")
            console.log({ message: "New User created", Usercode: 1 })
            

            res.send({ message: "New User created", Usercode: 1 })
            res.end()
            console.log("End of transaction...")

        })
    })
})


export const UsersRoutes = Userrouter