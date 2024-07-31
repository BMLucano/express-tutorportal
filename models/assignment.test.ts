import { describe, test, it, expect, afterAll, afterEach, beforeAll, beforeEach } from "vitest";
import { NotFoundError, BadRequestError } from "../expressError";

import db from "../db";
import Assignment from "./assignment";

import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testAssignmentIds,
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

describe("Assignment model", function(){

  /********** create */

  describe("create", function () {
    const newAssignment = {
      title: "New Assignment",
      description: "New Description",
      dueDate: "2023-07-03",
    };

    test("works", async function () {
      let assignment = await Assignment.create(newAssignment);
      expect(assignment).toEqual({
        ...newAssignment,
        id: expect.any(Number),
      });

      const result = await db.query(
        `SELECT title, description, TO_CHAR(due_date, 'YYYY-MM-DD') AS "dueDate"
         FROM assignments
         WHERE title = 'New Assignment'`
      );
      expect(result.rows).toEqual([
        {
          title: "New Assignment",
          description: "New Description",
          dueDate: "2023-07-03",
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
      dueDate: "2023-07-04",
    };

    test("works", async function () {
      let assignment = await Assignment.update(testAssignmentIds[0], updateData);
      expect(assignment).toEqual({
        id: testAssignmentIds[0],
        ...updateData,
      });

      const result = await db.query(
            `SELECT id, title, description, TO_CHAR(due_date, 'YYYY-MM-DD') AS "dueDate"
             FROM assignments
             WHERE id = $1`, [testAssignmentIds[0]]);
      expect(result.rows[0]).toEqual({
        id: testAssignmentIds[0],
        title: "Updated Assignment",
        description: "Updated Description",
        dueDate: "2023-07-04",
      });
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
      //Create a new assignment
      const result = await db.query(`
        INSERT INTO assignments (title, description, due_date)
        VALUES ('Test Assignment', 'This is a test', '2024-07-23')
        RETURNING id
        `);
      const assignmentId = result.rows[0].id;

      //delete the assignment
      await Assignment.delete(assignmentId);

      const deletedResult = await db.query(`
        SELECT * FROM assignments WHERE id = $1`,
        [assignmentId]
      );
      expect(deletedResult.rows).toEqual([]);
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
      let assignment = await Assignment.get(testAssignmentIds[0]);
      expect(assignment).toEqual({
        id: testAssignmentIds[0],
        title: "Assignment1",
        description: "Desc1",
        dueDate: "2023-07-01",
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
          id: testAssignmentIds[0],
          title: "Assignment1",
          description: "Desc1",
          dueDate: "2023-07-01",
          questions: expect.any(Array),
        },
        {
          id: testAssignmentIds[1],
          title: "Assignment2",
          description: "Desc2",
          dueDate: "2023-07-02",
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
})


