import express, { Express, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import verifyJWT from "./middleware/verifyJWT";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";

// Load configuration
dotenv.config({ path: ".env" });

// Setup
const app: Express = express();
const port = process.env.PORT || 8080;
const host = process.env.HOST;
const server = http.createServer(app);
mongoose.connect(process.env.MONGODB_URI ?? "");
const database = mongoose.connection;

//Middleware
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Socket
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
app.set("socket.io", io);

// Route List
import authUser from "./routes/auth";
import registerUser from "./routes/register";
import pdf from "./routes/pdf";
import chat from "./routes/chat";

app.get("/", (_: Request, res: Response) => {
  res.send("AskPDF Server");
});

app.use("/v1/register", registerUser);
app.use("/v1/auth", authUser);
app.use("/v1/pdf", verifyJWT, pdf);
app.use("/v1/chat", chat);

//Server
database.once("connected", () => {
  console.log("Connected to MongoDB");
  server.listen(port, () => console.log(`Server running on port ${port}`));
});
