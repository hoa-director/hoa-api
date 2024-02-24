import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import indexRoutes from "./routes/index";
import apiRoutes from "./routes/api";
import userRoutes from "./routes/user";
// import { bugsnagClient } from "./config/bugsnag";

import checkAuth from './middleware/check-auth';

// const bugsnagExpress = bugsnagClient.getPlugin("express");

export class App {
  public express: Express;

  constructor() {
    this.express = express();;
    this.express.use(cors<Request>());
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
    // this.express.use("/api/", checkAuth, apiRoutes);
    this.express.use("/api/", apiRoutes);
    this.express.use("/user/", userRoutes);
    this.express.use("/users/", userRoutes);
    this.express.use("/*", indexRoutes);
  }
}

const app = new App().express;
export default app;