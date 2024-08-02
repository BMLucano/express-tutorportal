import { describe, test, expect, afterAll, afterEach, beforeAll, beforeEach } from "vitest";
import {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} from "../expressError";

import db from "../db";
import User from "./user";

import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} from "./helpers/_testCommon";

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

describe("User model", function(){
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
        username: "new2"
      });
      expect(user).toEqual({ ...newUser, role: "tutor", username: "new2" });
      const found = await db.query("SELECT * FROM users WHERE username = 'new2'");
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

  describe("getAll", function() {
    test("works", async function () {
      const users = await User.getAll();
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

  /************ get dashboard data */

  describe("getUserDashboard", function () {
    test("works", async function () {
      const dashboardData = await User.getUserDashboard("u1");
      expect(dashboardData).toEqual({
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
      });
    });

    test("not found if no such user", async function () {
      try {
        await User.getUserDashboard("nope");
        throw new Error("fail test, you shouldn't get here");
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });

    test("limit works", async function () {
      const dashboardData = await User.getUserDashboard("u1", 1);
      expect(dashboardData.recentAssignments.length).toEqual(1);
      expect(dashboardData.recentResources.length).toEqual(1);
      expect(dashboardData.recentNotes.length).toEqual(1);
    });
  });
})


//TODO: tests for  update, resetPassword