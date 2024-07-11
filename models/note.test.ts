import { describe, test, it, expect } from "vitest";
import { NotFoundError, BadRequestError } from "../expressError";

import db from "../db";
import Note from "./note";

import { afterAll, beforeAll } from "vitest";
import { afterEach, beforeEach } from "node:test";
import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************ create */

describe("create", function () {
  const newNote = {
    studentUsername: "u1",
    title: "Note1",
    contentPath: "path1",
    sessionId: 1,
  };

  test("works", async function () {
    let note = await Note.create(newNote);
    expect(note).toEqual({
      id: expect.any(Number),
      ...newNote,
    });

    const result = await db.query(
      `SELECT student_username, title, content_path, session_id
       FROM notes
       WHERE student_username = 'u1' AND title = 'Note1' AND content_path = 'path1' AND session_id = 1`
    );
    expect(result.rows).toEqual([
      {
        student_username: "u1",
        title: "Note1",
        content_path: "path1",
        session_id: 1,
      },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
      await Note.create(newNote);
      await Note.create(newNote);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});


/********** update */

describe("update", function () {
  const updateNote = {
    title: "New Title",
    contentPath: "New Path",
  };

  test("works", async function () {
    let note = await Note.update(1, updateNote);
    expect(note).toEqual({
      id: 1,
      studentUsername: "u1",
      ...updateNote,
      sessionId: 1,
    });

    const result = await db.query(
      `SELECT student_username, title, content_path, session_id
       FROM notes
       WHERE id = 1`
    );
    expect(result.rows).toEqual([
      {
        student_username: "u1",
        title: "New Title",
        content_path: "New Path",
        session_id: 1,
      },
    ]);
  });

  test("not found", async function () {
    try {
      await Note.update(999, updateNote);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/************** delete */

describe("delete", function () {
  test("works", async function () {
    await Note.delete(1);
    const result = await db.query(`SELECT * FROM notes WHERE id = 1`);
    expect(result.rows).toEqual([]);
  });

  test("not found", async function () {
    try {
      await Note.delete(999);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/**************** getNotesByStudent */

describe("getNotesByStudent", function () {
  test("works", async function () {
    let notes = await Note.getNotesByStudent("u1");
    expect(notes).toEqual([
      {
        id: 1,
        studentUsername: "u1",
        title: "Note1",
        contentPath: "path1",
        sessionId: 1,
      },
    ]);
  });

  test("not found", async function () {
    try {
      await Note.getNotesByStudent("u3");
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/************** getNotesBySession */

describe("getNotesBySession", function () {
  test("works", async function () {
    let notes = await Note.getNotesBySession(1);
    expect(notes).toEqual([
      {
        id: 1,
        studentUsername: "u1",
        title: "Note1",
        contentPath: "path1",
        sessionId: 1,
      },
    ]);
  });

  test("not found", async function () {
    try {
      await Note.getNotesBySession(999);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});