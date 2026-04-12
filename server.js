import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ConnectDb from "./config/db.js";
import collegeRoutes from "./routes/college.route.js";
import userRoutes from "./routes/user.route.js";
import blogRoutes from "./routes/blog.route.js";
import contactInfoRoutes from "./routes/contactInfo.route.js";
import sitemapRoutes from "./routes/sitemap.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", collegeRoutes);
app.use("/api", userRoutes);
app.use("/api", blogRoutes);
app.use("/api", contactInfoRoutes);
app.use("/api", sitemapRoutes);

app.get("/", (_req, res) => {
  res.send("I am working");
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    uptime: process.uptime(),
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await ConnectDb();
    app.listen(PORT, () => {
      console.log(`Server started on ${PORT} with database connection`);
    });
  } catch (error) {
    console.error("Server startup aborted because database connection failed.");
    process.exit(1);
  }
};

startServer();
