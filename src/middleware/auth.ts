import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import { UnauthorizedError } from "../expressError";

interface Req extends Request {
  headers: {
    authorization?: string;
  }
}

/****
 * Middleware to authenticate jwt.
 * Verifies jwt and stores token payload on res.locals
 *
 * No error if valid token not provided.
 */
function jwtAuth(req: Req, res: Response, next: NextFunction){
  const authHeader = req.headers?.authorization;

  if (authHeader) {
    const token = authHeader.replace(/^[Bb]earer\s+/, "").trim();

    try {
      res.locals.user = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      console.error('JWT verification failed:', err);
    }
  }

  return next();
}

/**
 * Middleware to ensure that the logged in user is a student.
 */

function studentAuth(req: Request, res: Response, next: NextFunction){
  if (!res.locals.user) {
    throw new UnauthorizedError();
  }

  if(res.locals.user.role === 'student') return next();
  throw new UnauthorizedError();
}

/**
 * Middleware to ensure that the logged in user is a tutor.
 */

function tutorAuth(req: Request, res: Response, next: NextFunction){
  if (!res.locals.user) {
    throw new UnauthorizedError();
  }

  if (res.locals.user.role === 'tutor') return next();
  throw new UnauthorizedError();
}

function ensureUser(req: Request, res: Response, next: NextFunction){

  //first check if role exists on res.local.user (if not caught here, will throw 500 err)
  if (!res.locals.user) {
    throw new UnauthorizedError();
  }

  if (res.locals.user.role === 'tutor' || res.locals.user.role === 'student'){
   return next();
  }

  throw new UnauthorizedError();

}

export {
  jwtAuth,
  studentAuth,
  tutorAuth,
  ensureUser
}