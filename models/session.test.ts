import { describe, test, it, expect } from "vitest";
import { NotFoundError, BadRequestError } from "../expressError";

import db from "../db";
import Session from "./session";

import { afterAll, beforeAll } from "vitest";
import { afterEach, beforeEach } from "vitest";
import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testSessionIds,
} from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/************ create */

describe("create", function () {
  test("works", async function () {
    let session = await Session.create({
      studentUsername: "u1",
      date: "2022-01-01",
      time: "10:00:00",
      duration: "01:00:00",
      notes: "Test session",
    });
    expect(session).toEqual({
      id: expect.any(Number),
      studentUsername: "u1",
      date: expect.any(Date),
      time: "10:00:00",
      duration: expect.any(Object),
      notes: "Test session",
    });
  });

  test("bad request with dupe", async function () {
    try {
      await Session.create({
        studentUsername: "u1",
        date: "2022-01-01",
        time: "10:00:00",
        duration: "01:00:00",
        notes: "Test session",
      });
      await Session.create({
        studentUsername: "u1",
        date: "2022-01-01",
        time: "10:00:00",
        duration: "01:00:00",
        notes: "Test session",
      });
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});


/*************** update */

describe("update", function () {
  test("works", async function () {
    let session = await Session.update(testSessionIds[0], {
      duration: "02:00:00",
      notes: "Updated test session",
    });
    expect(session).toEqual({
      id: testSessionIds[0],
      studentUsername: "u1",
      date: expect.any(Date),
      time: "10:00:00",
      duration: expect.any(Object),
      notes: "Updated test session",
    });
  });

  test("not found", async function () {
    try {
      await Session.update(999, {
        duration: "02:00:00",
        notes: "Updated test session",
      });
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/**************** delete */

describe("delete", function () {
  test("works", async function () {
    const newSess = await db.query(`
      INSERT INTO sessions (student_username, date, time, duration, notes)
      VALUES ('u1', '2024-07-27', '10:00:00', '01:00:00', 'test')
      RETURNING id`)
    const newSessId = newSess.rows[0].id;

    await Session.delete(newSessId);
    const result = await db.query(`SELECT * FROM sessions WHERE id = $1`,
      [newSessId],
    );
    expect(result.rows).toEqual([]);
  });

  test("not found", async function () {
    try {
      await Session.delete(999);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/*************** get */

describe("get", function () {
  test("works", async function () {
    let session = await Session.get(1);
    expect(session).toEqual({
      id: 1,
      studentUsername: "u1",
      date: "2022-01-01",
      time: "10:00:00",
      duration: "01:00:00",
      notes: "Test session",
    });
  });

  test("not found", async function () {
    try {
      await Session.get(999);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/******************* getAll */

describe("getAll", function () {
  test("works", async function () {
    let sessions = await Session.getAll();
    expect(sessions).toEqual([
      {
        id: 1,
        studentUsername: "u1",
        date: "2022-01-01",
        time: "10:00:00",
        duration: "01:00:00",
        notes: "Test session",
      },
    ]);
  });
});


/************** getSessionsByStudent */
describe("getSessionsByStudent", function () {
  test("works", async function () {
    let sessions = await Session.getSessionsByStudent("u1");
    expect(sessions).toEqual([
      {
        id: 1,
        studentUsername: "u1",
        date: "2022-01-01",
        time: "10:00:00",
        duration: "01:00:00",
        notes: "Test session",
      },
    ]);
  });

  test("not found", async function () {
    try {
      await Session.getSessionsByStudent("u3");
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
