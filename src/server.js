import express from 'express'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js' //import the auth routes from the authRoutes.js file
import todoRoutes from './routes/todoRoutes.js' //import the todo routes from the todoRoutes.js file

const app = express() //create an instance of the express application
const PORT = process.env.PORT || 5003 //set the port to listen on, default to 5003 if not specified in environment variables


// get the file path from the url of the current module 
const __filename = fileURLToPath(import.meta.url) //get the file path of the current module
//the directory name from the file path
const __dirname = dirname(__filename) //get the directory name from the file path


//middleware
app.use(express.json())

app.use(express.static(path.join(__dirname, '../public'))) //serve static files from the public directory
//Serving up the html file from the /public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')) //send the index.html file to the client 
})

// Routes
app.use('/auth', authRoutes) //use the authRoutes middleware for the /auth route
app.use('/todos', todoRoutes) //use the todoRoutes middleware for the /todos route

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`) //log a message when the server starts
})
