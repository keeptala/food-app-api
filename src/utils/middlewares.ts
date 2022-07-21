import { NextFunction,Response } from "express";
import * as jwt from 'jsonwebtoken';


export const TokenMiddleware = (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    const token = req.header("Authorization");
    if (!token){
        res.status(401);
        res.send("ACCESS DENIED");
    }
  
    try {
      const verifiedToken: any = jwt.verify(
        token,
        process.env.SECREATE_TOKEN as string
      );
      req.UserId = verifiedToken.id as string;

      next();
    } catch (error) {
      res.status(400).send("Invalid Token");
    }
  };

  export const addPath = (pic: any) => {
    const name = Date.now() + pic.name;
    return name;
  };

  const errorTypes = {
    ValidationError: 422,
    UniqueViolationError: 409,
  };
  
  const errorMessages = {
    UniqueViolationError: "Already exists.",
  };
  
  export function notFound(
    req,
    res,
    next
  ) {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  }
  
  // eslint-disable-next-line no-unused-vars
  export function errorHandler(
    error,
    _req: any,
    res,
    _next: any
  ) {
    const statusCode =
      res.statusCode === 200
        ? errorTypes.UniqueViolationError || 500
        : res.statusCode;
    res.status(statusCode);
    res.json({
      status: statusCode,
      message: errorMessages.UniqueViolationError || error.message,
      stack: process.env.NODE_ENV === "production" ? "🥞" : error.stack,
      errors: error.errors || undefined,
    });
  }