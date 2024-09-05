import { describe, test, it, expect, beforeAll, beforeEach, afterAll, afterEach } from "vitest";
import request from "supertest";

import app from "../app";
import { createToken } from "../models/helpers/tokens";
import Session from "../models/session";

import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testSessionIds,
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

const studentToken = createToken("u1", 'student');
const tutorToken = createToken("u2", 'tutor');


describe("Sessions routes", async function(){

  describe("GET /resources", function(){

    test("gets all resources for student", async function () {
      const resp = await request(app)
        .get("/sessions")
        .set("Authorization", `Bearer ${studentToken}`);

        expect(resp.body).toEqual([
          {
            id: testSessionIds[0],
            studentUsername: "u1",
            date: expect.any(Number),
            time: "10:00:00",
            duration: expect.any(Object),
            notes: "Notes1",
          }
        ]);
    });

    test("get all sessions for tutor", async function(){
      const resp = await request(app)
        .get("/sessions")
        .set("Authorization", `Bearer ${tutorToken}`);

      expect(resp.body).toEqual([
        {
          id: testSessionIds[0],
          studentUsername: "u1",
          date: expect.any(Date),
          time: "10:00:00",
          duration: expect.any(Object),
          notes: "Notes1",
        },
        {
          id: testSessionIds[1],
          studentUsername: "u2",
          date: expect.any(Date),
          time: "11:00:00",
          duration: expect.any(Object),
          notes: "Notes2",
        },
      ]);
    });

    test("unauth for anon", async function(){
      const resp = await request(app)
        .get("/sessions");
      expect(resp.statusCode).toEqual(401);
    });
  })
})