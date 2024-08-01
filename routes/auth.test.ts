import request from "supertest";
import { describe, test, expect, afterAll, afterEach, beforeAll, beforeEach } from "vitest";
import app from "../app";

import {
  commonBeforeAll,
  commonAfterAll,
  commonAfterEach,
  commonBeforeEach,
 } from "../models/helpers/_testCommon";

beforeEach(async () => {
  await commonBeforeEach();
});

beforeAll(async () => {
  await commonBeforeAll();
});


afterEach(async () => {
  await commonAfterEach();
});

afterAll(async () => {
  await commonAfterAll();
});

describe("Auth routes", function(){

  /********** auth/token */
  describe("auth/token", function(){
    test("works", async function() {
      const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "u1",
        password: "password1",
      });
      expect(resp.body).toEqual({
        "token": expect.any(String),
      });
    })

    test("unauth with non-existent user", async function () {
      const resp = await request(app)
          .post("/auth/token")
          .send({
            username: "no-such-user",
            password: "password1",
          });
      expect(resp.statusCode).toEqual(401);
    });

    test("unauth with wrong password", async function () {
      const resp = await request(app)
          .post("/auth/token")
          .send({
            username: "u1",
            password: "nope-nope",
          });
      expect(resp.statusCode).toEqual(401);
    });

    test("bad request with missing data", async function () {
      const resp = await request(app)
          .post("/auth/token")
          .send({
            username: "u1",
          });
      expect(resp.statusCode).toEqual(400);
    });

    test("bad request with invalid data", async function () {
      const resp = await request(app)
          .post("/auth/token")
          .send({
            username: 42,
            password: "above-is-a-number",
          });
      expect(resp.statusCode).toEqual(400);
    });
  })

  /********** auth/register */
  describe("auth/register", function(){

    test("works for anon", async function () {
      const resp = await request(app)
          .post("/auth/register")
          .send({
            username: "new",
            firstName: "first",
            lastName: "last",
            password: "password",
            email: "new@email.com",
          });
      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toEqual({
        "token": expect.any(String),
      });
    });

    test("bad request with missing fields", async function () {
      const resp = await request(app)
          .post("/auth/register")
          .send({
            username: "new",
          });
      expect(resp.statusCode).toEqual(400);
    });

    test("bad request with invalid data", async function () {
      const resp = await request(app)
          .post("/auth/register")
          .send({
            username: "new",
            firstName: "first",
            lastName: "last",
            password: "password",
            email: "not-an-email",
          });
      expect(resp.statusCode).toEqual(400);
    });
  })
})