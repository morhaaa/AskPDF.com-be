import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

// Load configuration
dotenv.config({ path: ".env" }); // load env configuration

// Setup
const app: Express = express();
const port = process.env.PORT || 8080;
const host = process.env.HOST

// Route List
import routerUser from "./routes/user";

app.use("/users", routerUser)

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});