import jwt from "jsonwebtoken";

function authMiddleware (req,res,next){
    const token = req.headers["Authorization"]?.split(" ")[1] //get the token from the authorization header
    if(!token){
        {return res.sendStatus(401).json({message:"No token provided"})} //send a 401 status code if there is no token

        jwt.verify(token, process.env.JWT_SECRET, (err,decoded) => {
            if(err){
                return res.sendStatus(403) //send a 403 status code if the token is invalid
            }
            req.user = decoded //add the user to the request object
            next() //call the next middleware function
        })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err,decoded) => {
        if(err){
            return res.sendStatus(403) //send a 403 status code if the token is invalid
        }
        req.user = decoded //add the user to the request object
        next() //call the next middleware function
    })
}