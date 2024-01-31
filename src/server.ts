import express, { Express, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import verifyJWT from "./middleware/verifyJWT";
import cookieParser from "cookie-parser"
// Load configuration
dotenv.config({ path: ".env" }); // load env configuration

// Setup
const app: Express = express();
const port = process.env.PORT || 8080;
const host = process.env.HOST;
mongoose.connect(process.env.MONGODB_URI ?? "");
const database = mongoose.connection;

//Middleware
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route List
import authUser from "./routes/auth";
import registerUser from "./routes/register";
import pdf from "./routes/pdf";

app.get("/", (_: Request, res: Response) => {
  res.send("Crypto bot Server");
});
app.use("/v1/register", registerUser);
app.use("/v1/auth", authUser);
app.use(verifyJWT);
app.use("/v1/pdf",pdf)

//Server
database.once("connected", () => {
  console.log("Connected to MongoDB");
  app.listen(port, () => console.log(`Server running on port ${port}`));
});
