import { describe, test, it, expect } from "vitest";
import { NotFoundError, BadRequestError } from "../expressError";

import db from "../db";
import Assignment from "./assignment";

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


/********** create */

describe("create", function () {
  const newAssignment = {
    title: "New Assignment",
    description: "New Description",
    dueDate: new Date("2023-07-03"),
  };

  test("works", async function () {
    let assignment = await Assignment.create(newAssignment);
    expect(assignment).toEqual({
      ...newAssignment,
      id: expect.any(Number),
    });

    const result = await db.query(
      `SELECT title, description, due_date
       FROM assignments
       WHERE title = 'New Assignment'`
    );
    expect(result.rows).toEqual([
      {
        title: "New Assignment",
        description: "New Description",
        due_date: new Date("2023-07-03"),
      },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
      await Assignment.create(newAssignment);
      await Assignment.create(newAssignment);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});


/************** update */

describe("update", function () {
  const updateData = {
    title: "Updated Assignment",
    description: "Updated Description",
    dueDate: new Date("2023-07-04"),
  };

  test("works", async function () {
    let assignment = await Assignment.update(1, updateData);
    expect(assignment).toEqual({
      id: 1,
      ...updateData,
    });

    const result = await db.query(
          `SELECT id, title, description, due_date
           FROM assignments
           WHERE id = 1`);
    expect(result.rows).toEqual([{
      id: 1,
      title: "Updated Assignment",
      description: "Updated Description",
      due_date: new Date("2023-07-04"),
    }]);
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
      title: "Updated Assignment",
      description: null,
      dueDate: null,
    };

    let assignment = await Assignment.update(1, updateDataSetNulls);
    expect(assignment).toEqual({
      id: 1,
      ...updateDataSetNulls,
    });

    const result = await db.query(
          `SELECT id, title, description, due_date
           FROM assignments
           WHERE id = 1`);
    expect(result.rows).toEqual([{
      id: 1,
      title: "Updated Assignment",
      description: null,
      due_date: null,
    }]);
  });

  test("not found if no such assignment", async function () {
    try {
      await Assignment.update(999, updateData);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Assignment.update(1, {});
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});


/*********** delete */

describe("delete", function () {
  test("works", async function () {
    await Assignment.delete(1);
    const result = await db.query(`SELECT * FROM assignments WHERE id = 1`);
    expect(result.rows).toEqual([]);
  });

  test("not found", async function () {
    try {
      await Assignment.delete(999);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/*********** get */

describe("get", function () {
  test("works", async function () {
    let assignment = await Assignment.get(1);
    expect(assignment).toEqual({
      id: 1,
      title: "Assignment1",
      description: "Desc1",
      dueDate: new Date("2023-07-01"),
      questions: expect.any(Array),
    });
  });

  test("not found", async function () {
    try {
      await Assignment.get(999);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/*************** getAll */

describe("getAll", function () {
  test("works", async function () {
    let assignments = await Assignment.getAll();
    expect(assignments).toEqual([
      {
        id: 1,
        title: "Assignment1",
        description: "Desc1",
        dueDate: new Date("2023-07-01"),
        questions: expect.any(Array),
      },
      {
        id: 2,
        title: "Assignment2",
        description: "Desc2",
        dueDate: new Date("2023-07-02"),
        questions: expect.any(Array),
      },
    ]);
  });

  test("no assignments", async function () {
    // Clear the assignments table
    await db.query("DELETE FROM assignments");

    let assignments = await Assignment.getAll();
    expect(assignments).toEqual([]);
  });
});


