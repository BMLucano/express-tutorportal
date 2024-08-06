import { describe, test, it, expect, beforeAll, beforeEach, afterAll, afterEach } from "vitest";
// @ts-ignore  TODO: why can't it import supertest for types?
import request from "supertest";

import app from "../app";
// import { studentToken, tutorToken, testUserIds } from "./models/helpers/_testCommon";
import { createToken } from "../models/helpers/tokens";
import { create } from "domain";

import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testAssignmentIds,
  testUserIds,
  studentToken,
  tutorToken
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


// console.log("testUserids", testUserIds)
// const studentToken = createToken("u1", 'student');
// const tutorToken = createToken("u2", 'tutor');
const notValidUserToken = createToken("u3", 'student')

describe("GET dashboard", function() {

  test("works", async function(){
    const resp = await request(app)
      .get('/dashboard')
      .set("authorization", `Bearer ${studentToken}`);;
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        role: "student",
      },
      nextSession: expect.any(Object),
      recentAssignments: expect.any(Array),
      recentResources: expect.any(Array),
      recentNotes: expect.any(Array),
    })
  })
})