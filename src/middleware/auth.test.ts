import jwt from "jsonwebtoken";
import { describe, test, expect } from "vitest";
import { UnauthorizedError } from "../expressError";

import { jwtAuth, studentAuth, tutorAuth } from "./auth";

import { SECRET_KEY } from "../config";
const goodJwt = jwt.sign({ username: "test", role: 'student' }, SECRET_KEY);
const badJwt = jwt.sign({ username: "test", isAdmin: 'student' }, "wrong");

function next(err?: Error | string) {
  if (err) throw new Error("Got error from middleware");
}

describe("jwtAuthentication", function(){
  test("works: with header", function() {
    const req = { headers: { authorization: `Bearer ${goodJwt}` } };
    const res = { locals: {} };
    jwtAuth(req as any, res as any, next);
    expect(res.locals).toEqual({
      user: {
        iat: expect.any(Number),
        username: "test",
        role: 'student',
      },
    });
  });

  test("unauth: no header", function() {
    const req = {};
    const res = { locals: {}, status: null };
    jwtAuth(req as any, res as any, next);
    expect(res.status).toEqual(401);
  });

  test("unauth: wrong jwt signature", function() {
    const req = { headers: { authorization: `Bearer ${badJwt}` } };
    const res = { locals: {}, status: null };
    jwtAuth(req as any, res as any, next);
    expect(res.status).toEqual(401);
  });
})