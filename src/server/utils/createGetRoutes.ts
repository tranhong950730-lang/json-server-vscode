import express, { Router } from "express";
import { Helper } from "./helper";

export const InitGetRoutes = () => {
  const getRouter: Router = express.Router();

  Helper.getURLKeys.forEach((key) => {
    const routePath = `/${key.replace(/^\/+|\/+$/g, "")}`;
    getRouter.get(routePath, (req, res) => {
      res.json(Helper.getJSONObject[key]);
    });
  });

  return getRouter;
};

// export default getRouter;
