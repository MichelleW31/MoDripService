import { Router } from "express";
import userRoutes from "./users.js";
import modRoutes from "./mods.js";
import targetDataRoutes from "./targetData.js";

let rootRouter = Router();

rootRouter.use("/users", userRoutes);
rootRouter.use("/mods", modRoutes);
rootRouter.use("/target_data", targetDataRoutes);

rootRouter.get("/", (req, res) => {
  res.status(200).send("Welcome to MoDrip");
});

export default rootRouter;
