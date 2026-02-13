import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import ConnectDb from "./config/db.js"
import collegeRoutes from "./routes/college.route.js"
import userRoutes from "./routes/user.route.js"
dotenv.config()


const app = express()

app.use(cors())
app.use(express.json())

app.use("/api", collegeRoutes)
app.use("/api", userRoutes)

const PORT = process.env.PORT 


app.listen(PORT , ()=>{
    ConnectDb()
    console.log(`Server Started to ${PORT}`)
})