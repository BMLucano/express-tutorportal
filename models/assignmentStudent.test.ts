import { describe, test, it, expect } from "vitest";
import { NotFoundError, BadRequestError } from "../expressError";

import db from "../db";
import AssignmentStudent from "./assignmentStudent";

import { afterAll, beforeAll } from "vitest";
import { afterEach, beforeEach } from "node:test";
import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testAssignmentIds
} from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/****** assign */

describe("assign", function () {
  test("works", async function () {
    let assignmentStudent = await AssignmentStudent.assign("u1", testAssignmentIds[0]);
    expect(assignmentStudent).toEqual({
      id: expect.any(Number),
      assignmentId: testAssignmentIds[0],
      studentUsername: "u1",
      status: "assigned",
    });

    const result = await db.query(`SELECT *
                                   FROM assignments_students
                                   WHERE assignment_id = $1
                                   AND student_username = 'u1'`,
                                  [testAssignmentIds[0]]);
    expect(result.rows[0]).toEqual(
      {
        id: expect.any(Number),
        assignment_id: testAssignmentIds[0],
        student_username: 'u1',
        status: 'assigned'
      }
    );
  });

  test("not found if student not found", async function () {
    try {
      await AssignmentStudent.assign("unknown", testAssignmentIds[0]);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("not found if assignment not found", async function () {
    try {
      await AssignmentStudent.assign("u1", 0);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/****** updateStatus */

describe("updateStatus", function () {
  test("works", async function () {
    let assignmentStudent = await AssignmentStudent.updateStatus("u1", 1, "in progress");
    expect(assignmentStudent).toEqual({
      id: expect.any(Number),
      assignmentId: 1,
      studentUsername: "u1",
      status: "in progress",
    });

    const result = await db.query(`SELECT * FROM assignments_students WHERE assignment_id = 1 AND student_username = 'u1'`);
    expect(result.rows).toEqual([
      {
        id: expect.any(Number),
        assignment_id: 1,
        student_username: 'u1',
        status: 'in progress'
      }
    ]);
  });

  test("not found if student not found", async function () {
    try {
      await AssignmentStudent.updateStatus("unknown", 1, "in progress");
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************** getAssignmentsByStudent */

describe("getAssignmentsByStudent", function () {
  test("works", async function () {
    let assignments = await AssignmentStudent.getAssignmentsByStudent("u1");
    expect(assignments).toEqual([
      {
        id: 1,
        title: "Assignment1",
        description: "Desc1",
        dueDate: new Date("2023-07-01"),
        questions: expect.any(Array),
      },
    ]);
  });

  test("not found if student not found", async function () {
    try {
      await AssignmentStudent.getAssignmentsByStudent("unknown");
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/*************** getAssignmentsByStatus */

describe("getAssignmentsByStatus", function () {
  test("works", async function () {
    let assignments = await AssignmentStudent.getAssignmentsByStatus("assigned", "student1");
    expect(assignments).toEqual([
      {
        id: 1,
        title: "Assignment1",
        description: "Desc1",
        dueDate: new Date("2023-07-01"),
        questions: expect.any(Array),
      },
    ]);
  });

  test("not found if student not found", async function () {
    try {
      await AssignmentStudent.getAssignmentsByStatus("assigned", "unknown");
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/************** getStudentsByAssignment */

describe("getStudentsByAssignment", function () {
  test("works", async function () {
    let students = await AssignmentStudent.getStudentsByAssignment(1);
    expect(students).toEqual([
      {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        role: "student",
      },
    ]);
  });

  test("not found if assignment not found", async function () {
    try {
      await AssignmentStudent.getStudentsByAssignment(999);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
})