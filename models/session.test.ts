import { describe, test, it, expect, afterAll, afterEach, beforeAll, beforeEach } from "vitest";
import { NotFoundError, BadRequestError } from "../expressError";

import db from "../db";
import Session from "./session";

import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testSessionIds,
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

describe("Session model", function(){

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
        id: expect.any(Number),
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
      let session = await Session.get(testSessionIds[0]);
      expect(session).toEqual({
        id: expect.any(Number),
        studentUsername: "u1",
        date: expect.any(Date),
        time: "10:00:00",
        duration: expect.any(Object),
        notes: "Notes1",
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
          id: expect.any(Number),
          studentUsername: "u1",
          date: expect.any(Date),
          time: "10:00:00",
          duration: expect.any(Object),
          notes: "Notes1",
        },
        {
          id: expect.any(Number),
          studentUsername: "u2",
          date: expect.any(Date),
          time: "11:00:00",
          duration: expect.any(Object),
          notes: "Notes2",
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
          id: expect.any(Number),
          studentUsername: "u1",
          date: expect.any(Date),
          time: "10:00:00",
          duration: expect.any(Object),
          notes: "Notes1",
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
})
