import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/****
 * Middleware to authenticate jwt.
 * Verifies jwt and stores token payload on res.locals
 *
 * Error if not a valid token.
 */
function jwtAuth(req: Request, res: Response, next: NextFunction){

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