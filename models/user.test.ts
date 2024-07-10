import { describe, test, it, expect } from "vitest";
import {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} from "../expressError";

import db from "../db";
import User from "./user";
import { afterAll, beforeAll } from "vitest";
import { afterEach, beforeEach } from "node:test";

import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  testAssignmentIds,
  testQuestionIds,
  testSubmissionIds,
  testNoteIds,
  testResourceIds,
  testSessionIds,
  testMessageIds,
  testAssignmentsStudentsIds,
} from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************ auth */

describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("u1", "password1");
    expect(user).toEqual({
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "u1@email.com",
      role: "student",
    });
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("noemail", "password");
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("u1", "wrongpassword");
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("works for tutor", async function () {
    const user = await User.authenticate("u2", "password2");
    expect(user).toEqual({
      username: "u2",
      firstName: "U2F",
      lastName: "U2L",
      email: "u2@email.com",
      role: "tutor",
    });
  });
});

/************ register */

describe("register", function () {
  const newUser = {
    username: "new",
    firstName: "Test",
    lastName: "Tester",
    email: "test@test.com",
    role: "student",
  };

  test("works", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
    });
    expect(user).toEqual(newUser);
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].role).toEqual("student");
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("works: adds tutor", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
      role: "tutor",
    });
    expect(user).toEqual({ ...newUser, role: "tutor" });
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].role).toEqual("tutor");
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with dup data", async function () {
    try {
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/********** findAll */

describe("findAll", function() {
  test("works", async function () {
    const users = await User.findAll();
    expect(users).toEqual([
      {
        username: 'u1',
        firstName: "U1F",
        lastName: 'U1L',
        email: 'u1@email.com',
        role: 'student'
      },
      {
        username: 'u2',
        firstName: "U2F",
        lastName: 'U2L',
        email: 'u2@email.com',
        role: 'tutor'
      },
    ]);
  });
});

/************ get by username */

describe("get", function () {
  test("works", async function () {
    let user = await User.get("u1");
    expect(user).toEqual({
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "u1@email.com",
      role: "student",
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.get("nope");
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

//TODO: tests for getUserDashboard, update, resetPassword