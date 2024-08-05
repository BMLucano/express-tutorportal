import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { describe, test, expect, vi } from "vitest";
import jest from 'jest';
import { UnauthorizedError } from "../expressError";

import { jwtAuth, studentAuth, tutorAuth } from "./auth";
import { testUserIds } from "../models/helpers/_testCommon";

import { SECRET_KEY } from "../config";
const goodJwt = jwt.sign({ username: testUserIds[0], role: 'student' }, SECRET_KEY);
const badJwt = jwt.sign({ username: testUserIds[1], role: 'student' }, "wrong");


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
describe("auth middleware", function(){
  //type casting
  const next: NextFunction = vi.fn() as unknown as NextFunction;

  describe("jwtAuthentication", function(){

    test("works: with header", function() {
      const req = { headers: { authorization: `Bearer ${goodJwt}` } };
      const res = { locals: {} };
      jwtAuth(req as any, res as Response, next);
      expect(res.locals).toEqual({
        user: {
          iat: expect.any(Number),
          username: testUserIds[0],
          role: 'student',
        },
      });
      expect(next).toHaveBeenCalled();
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

  describe("studentAuth", function(){
      test("works", function(){
        const req = {} as Request;
        const res = createMockResponse();
        res.locals.user = { role: 'student'};

        studentAuth(req, res, next);
        expect(next).toHaveBeenCalled();
      });

      test("unauth: not a student", function(){
        const req = {} as Request;
        const res = createMockResponse();
        res.locals.user = { role: 'tutor'};

        try{
          studentAuth(req, res, next);
        }catch(err){
          expect(err).toBeInstanceOf(UnauthorizedError)
        }
      });
  });

  describe("tutorAuth", function(){
    test("works", function(){
      const req = {} as Request;
      const res = createMockResponse();
      res.locals.user = { role: 'tutor'};

      tutorAuth(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test("unauth: not a tutor", function(){
      const req = {} as Request;
      const res = createMockResponse();
      res.locals.user = { role: 'student'};

      try{
        tutorAuth(req, res, next);
      }catch(err){
        expect(err).toBeInstanceOf(UnauthorizedError)
      }
    });
});

})