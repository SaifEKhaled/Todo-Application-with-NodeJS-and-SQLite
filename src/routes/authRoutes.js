import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

//Register a new user (/auth/register) 
router.post("/register", (req, res) => {
    const {username,password} = req.body
    const hashedPassword = bcrypt.hashSync(password, 8); //hash the password using bcrypt
    //save the new user and hashed password to the database
    try {
        const insertUser = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`)
        const result = insertUser.run(username, hashedPassword)

        // we want to add their first todo for the new user
        const defaultTodo =  `Hello :) Add your first todo!`
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
        insertTodo.run(result.lastInsertRowid, defaultTodo)

        //creating a token
        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, {
            expiresIn: '24h' // expires in 24 hours
        });
        res.json({token})
    } catch (error) {
        console.log(error.message);
        res.sendStatus(503) //send a 503 status code if there is an error
        
    }


    res.sendStatus(201)

});

router.post("/login",(req,res)=>{


    const {username,password} = req.body

    try {
        const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`)
        const user = getUser.get(username)
        //check if the user exists in the database
        //if the user does not exist, send a 404 status code
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        // check if the password is correct
        const passwordIsValid = bcrypt.compareSync(password, user.password) //compare the password with the hashed password
        if(!passwordIsValid){
            return res.status(401).json({accessToken: null, message: "Invalid password"})
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '24h' // expires in 24 hours
        });
        res.json({accessToken: token}) //send the token to the client
    } catch {err}{
        console.log(err.message);
        res.sendStatus(503) //send a 503 status code if there is an error
        
    }

});

export default router;
