import express, { Router } from "express";
import { InitGetRoutes } from "./utils/createGetRoutes";
import { InitPostRoutes } from "./utils/createPostRoutes";
import { Helper } from "./utils/helper";

export const JSONServeRoutes = () => {
  const router: Router = express.Router();
  // GET Routes Initialized
  router.get("/", (req, res) => {
    res.render("view", { data: Helper.getURLS() });
  });

  router.use("/api/", InitGetRoutes());
  router.use("/", InitPostRoutes());

  return router;
};
