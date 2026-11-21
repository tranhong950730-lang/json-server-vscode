import express, { Router } from "express";
import { Helper } from "./helper";

export const InitPostRoutes = () => {
  const postRouter: Router = express.Router();

  Helper.getURLKeys.forEach((key) => {
    const routePath = `/${key.replace(/^\/+|\/+$/g, "")}`;
    postRouter.post(routePath, (req, res) => {
      res.json(Helper.getJSONObject[key]);
    });
  });

  return postRouter;
};