const bodyParser = require("body-parser");
var cors = require('cors');
import * as express from "express";
import { NextFunction, Request, Response } from "express";
// import { bugsnagClient } from "./config/bugsnag";
import indexRoutes from "./routes";
import apiRoutes from "./routes/api";
import userRoutes from "./routes/user";

const checkAuth = require("./middleware/check-auth");

// const bugsnagExpress = bugsnagClient.getPlugin("express");

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.express.use(cors());
    this.middleware();
    this.routes();
    this.errorHandlers();
  }

  private middleware(): void {
    // this.express.use(bugsnagExpress.requestHandler);
    this.express.use((req: Request, res: Response, next: NextFunction) => {
      res.setHeader("Access-Control-Allow-Origin", "*" );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Disposition"
      );
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE, PUT, OPTIONS"
      );
      next();
    });
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(bodyParser.json());
  }

  private errorHandlers(): void {
    // this.express.use(bugsnagExpress.errorHandler);
  }

  private routes(): void {
    this.express.use("/api/", checkAuth, apiRoutes);
    this.express.use("/user/", userRoutes);
    this.express.use("/users/", userRoutes);
    this.express.use("/*", indexRoutes);
  }
}

export default new App().express;
