import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { describe, test, expect, vi } from "vitest";
import jest from 'jest';
import { UnauthorizedError } from "../expressError";

import { jwtAuth, studentAuth, tutorAuth } from "./auth";

import { SECRET_KEY } from "../config";
const goodJwt = jwt.sign({ username: "test", role: 'student' }, SECRET_KEY);
const badJwt = jwt.sign({ username: "test", isAdmin: 'student' }, "wrong");


function createMockResponse(): Response {
  return {
    locals: {},
    status: vi.fn().mockReturnThis(), //configures mock func to return the 'this' context (the res obj in this case)
    send: vi.fn(),
  } as unknown as Response;
}

// function next(err?: Error | string) {
//   if (err) throw new Error("Got error from middleware");
// }

describe("jwtAuthentication", function(){
    //type casting
  const next: NextFunction = vi.fn() as unknown as NextFunction;


  test("works: with header", function() {
    const req = {} as Request;
    const res = createMockResponse();

    jwtAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Unauthorized');
    expect(next).not.toHaveBeenCalled();
  });

  test("unauth: no header", function() {
    const req = {} as Request;

    const res = {
      locals: {},
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as Response;

    jwtAuth(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Unauthorized');
    expect(next).not.toHaveBeenCalled();
  });

  test("unauth: wrong jwt signature", function() {
    const req = { headers: { authorization: `Bearer ${badJwt}` } } as Request;
    const res = createMockResponse();

    jwtAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Unauthorized');
    expect(next).not.toHaveBeenCalled();
  });
})