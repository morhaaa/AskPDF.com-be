import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load configuration
dotenv.config({ path: ".env" }); // load env configuration

// Setup
const app: Express = express();
const port = process.env.PORT || 8080;
const host = process.env.HOST
mongoose.connect(process.env.MONGODB_URI ?? '');
const database = mongoose.connection;


// Route List
import authUser from "./routes/auth";

app.use("/v1/auth", authUser)


app.get("/", (req: Request, res: Response) => {
  res.send("Crypto bot Server");
});

database.once('connected', () => {
  console.log('Connected to MongoDB');
  app.listen(port, () => console.log(`Server running on port ${port}`));
});