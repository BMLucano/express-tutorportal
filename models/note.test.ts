import { describe, test, it, expect } from "vitest";
import { NotFoundError, BadRequestError } from "../expressError";

import db from "../db";
import Note from "./note";

import { afterAll, beforeAll } from "vitest";
import { afterEach, beforeEach } from "vitest";
import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testSessionIds,
  testUserIds,
  testNoteIds,
} from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************ create */

describe("create", function () {

  test("works", async function () {
    const newNote = {
      studentUsername: "u1",
      title: "Note1",
      contentPath: "newPath",
      sessionId: testSessionIds[0],
    };

    let note = await Note.create(newNote);
    expect(note).toEqual({
      id: expect.any(Number),
      ...newNote,
    });

    const result = await db.query(
      `SELECT student_username, title, content_path, session_id
       FROM notes
       WHERE student_username = 'u1' AND title = 'Note1' AND content_path = 'newPath' AND session_id = $1`,
       [testSessionIds[0]]
    );
    expect(result.rows).toEqual([
      {
        student_username: "u1",
        title: "Note1",
        content_path: "newPath",
        session_id: testSessionIds[0],
      },
    ]);
  });

  test("bad request with dupe", async function () {
    const newNote = {
      studentUsername: "u1",
      title: "Note1",
      contentPath: "path1",
      sessionId: testSessionIds[0],
    };

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
    let note = await Note.update(testNoteIds[0], updateNote);
    expect(note).toEqual({
      id: testNoteIds[0],
      studentUsername: "u1",
      ...updateNote,
      sessionId: testSessionIds[0],
    });

    const result = await db.query(
      `SELECT student_username, title, content_path, session_id
       FROM notes
       WHERE id = $1`,
       [testNoteIds[0]]
    );
    expect(result.rows).toEqual([
      {
        student_username: "u1",
        title: "New Title",
        content_path: "New Path",
        session_id: testSessionIds[0],
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
    const result = await db.query(`
      INSERT INTO notes (student_username, title, content_path, session_id)
      VALUES ($1, 'Note Title', 'Test Path', $2)
      RETURNING id`,
    [testUserIds[0], testSessionIds[0]]);
    const noteId = result.rows[0].id

    await Note.delete(noteId);

    const deletedResult = await db.query(`SELECT * FROM notes WHERE id = $1`,
      [noteId]
    );
    expect(deletedResult.rows).toEqual([]);
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


/***************** get */

describe("get", function () {
  test("works", async function () {
    let note = await Note.get(testNoteIds[0]);
    expect(note).toEqual({
      id: testNoteIds[0],
      studentUsername: "u1",
      title: "Note1",
      contentPath: "path1",
      sessionId: testSessionIds[0],
    });
  });

  test("not found", async function () {
    try {
      await Note.get(999);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/*************** getAll */

describe("getAll", function () {
  test("works", async function () {
    let notes = await Note.getAll();
    expect(notes).toEqual([
      {
        id: testNoteIds[0],
        studentUsername: "u1",
        title: "Note1",
        contentPath: "path1",
        sessionId: testSessionIds[0],
      },
      {
        id: testNoteIds[1],
        studentUsername: "u2",
        title: "Note2",
        contentPath: "path2",
        sessionId: testSessionIds[1],
      },
    ]);
  });
});


/**************** getNotesByStudent */

describe("getNotesByStudent", function () {
  test("works", async function () {
    let notes = await Note.getNotesByStudent("u1");
    expect(notes).toEqual([
      {
        id: testNoteIds[0],
        studentUsername: "u1",
        title: "Note1",
        contentPath: "path1",
        sessionId: testSessionIds[0],
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
    let notes = await Note.getNotesBySession(testSessionIds[0]);
    expect(notes).toEqual([
      {
        id: testNoteIds[0],
        studentUsername: "u1",
        title: "Note1",
        contentPath: "path1",
        sessionId: testSessionIds[0],
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