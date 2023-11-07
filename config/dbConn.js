import { set, connect } from "mongoose";
import * as dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

const CONNECTION_URL = process.env.MONGO_CONNECTION_URL;
const database = process.env.DATABASE_NAME;

class Database {
  // Creates a new Database instance and establishes a connection.

  constructor() {
    this._connect();
  }

  _connect() {
    set("strictQuery", false);

    connect(CONNECTION_URL, {
      authSource: "admin",
      ssl: true,
      dbName: database,
    })
      .then(() => {
        logger.info("Database connection successful");
      })
      .catch((err) => {
        logger.error("Database connection error", err);
      });
  }
}

export default new Database();
