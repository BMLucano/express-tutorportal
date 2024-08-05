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
    const req = { headers: { authorization: `Bearer ${goodJwt}` } };
    const res = { locals: {} };
    jwtAuth(req as any, res as Response, next);
    expect(res.locals).toEqual({
      user: {
        iat: expect.any(Number),
        username: "test",
        role: 'student',
      },
    });
  });

  test("unauth: no header", function() {
    const req = {} as Request;
    const res = createMockResponse();

    try {
      jwtAuth(req, res, next);
    } catch (err) {
      expect(err).toBeInstanceOf(UnauthorizedError);
    }

    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  test("unauth: wrong jwt signature", function() {
    const req = { headers: { authorization: `Bearer ${badJwt}` } } as Request;
    const res = createMockResponse();

    try {
      jwtAuth(req, res, next);
    } catch (err) {
      expect(err).toBeInstanceOf(UnauthorizedError);
    }

    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
})