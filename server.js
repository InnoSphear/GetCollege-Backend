import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import ConnectDb from "./config/db.js"
import collegeRoutes from "./routes/college.route.js"
import userRoutes from "./routes/user.route.js"
import blogRoutes from "./routes/blog.route.js"
import contactInfoRoutes from "./routes/contactInfo.route.js"
import sitemapRoutes from "./routes/sitemap.route.js"
dotenv.config()


const app = express()

app.use(cors())
app.use(express.json())

app.use("/api", collegeRoutes)
app.use("/api", userRoutes)
app.use("/api", blogRoutes)
app.use("/api", contactInfoRoutes)
app.use("/api", sitemapRoutes)

const PORT = process.env.PORT 


app.listen(PORT , ()=>{
    ConnectDb()
    console.log(`Server Started to ${PORT}`)
})
