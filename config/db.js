import dns from "node:dns";
import mongoose from "mongoose";

const configureDns = () => {
  const servers = (process.env.MONGO_DNS_SERVERS || "8.8.8.8,1.1.1.1")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (servers.length) {
    dns.setServers(servers);
  }
};

const ConnectDb = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in backend/.env");
  }

  configureDns();

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    console.log("Connected to DB using MONGO_URI");
    return true;
  } catch (error) {
    console.error(`DB connection failed via MONGO_URI: ${error.code || error.message}`);
    throw error;
  }
};

export default ConnectDb;
