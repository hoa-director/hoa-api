import { NextFunction, Request, Response, Router } from "express";
import jwt = require("jsonwebtoken");

module.exports = (req: Request, res: Response, next: NextFunction) => {
  try {
    // token comes in header with "bearer ioajglkajldgjla"
    // split on white space and take index 1, the token
    // will throw an error if header not found
    const token = req.headers.authorization.split(" ")[1];

    // will throw an error if validation fails
    // if no error, valid token
    // if error, then invalid token
    jwt.verify(token, process.env.SECRET)

    // call next to let the execution continue
    next();

  } catch {
    res.status(401).json({ message: "Authentication failed" });
  }
};
