import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import database from "./config/dbConn.js";
import logger from "./config/logger.js";

const app = express();
dotenv.config();

app.use(cors());

// Built in middleware for json
app.use(express.json());
app.use(express.urlencoded({ limit: "30mb", extended: true }));

//NEXT - ADD ROUTES
// app.use("/", rootRouter);

const PORT = process.env.PORT;

app.listen(PORT, function (err) {
  if (err) logger.error("Error in server setup");
  logger.info(`Server listening on Port ${PORT}`);
});
