import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";

interface Req extends Request {
  headers: {
    authorization?: string;
  }
}

/****
 * Middleware to authenticate jwt.
 * Verifies jwt and stores token payload on res.locals
 *
 * Error if not a valid token or no header provided.
 */
function jwtAuth(req: Req, res: Response, next: NextFunction){
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('Unauthorized');
  }

  const token = authHeader.replace(/^[Bb]earer\s+/, "").trim();

  try {
    res.locals.user = jwt.verify(token, SECRET_KEY);
    return next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(401).send('Unauthorized');
  }
}

/**
 * Middleware to ensure that the logged in user is a student.
 */

function studentAuth(req: Request, res: Response, next: NextFunction){

}

/**
 * Middleware to ensure that the logged in user is a tutor.
 */

function tutorAuth(req: Request, res: Response, next: NextFunction){

}

export {
  jwtAuth,
  studentAuth,
  tutorAuth
}