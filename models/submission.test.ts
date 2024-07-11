import { describe, test, it, expect } from "vitest";
import { NotFoundError, BadRequestError } from "../expressError";

import db from "../db";
// import User from "./user";
// import Assignment from "./assignment";
// import AssignmentStudent from "./assignmentStudent";
import Submission from "./submission";

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
  const newSubmission = {
    studentUsername: "u1",
    assignmentId: 1,
    questionId: 1,
    answer: "Answer",
  };

  test("works", async function () {
    let submission = await Submission.create(newSubmission);
    expect(submission).toEqual({
      ...newSubmission,
      id: expect.any(Number),
    });

    const result = await db.query(
      `SELECT student_username, assignment_id, question_id, answer
       FROM submissions
       WHERE student_username = 'u1' AND assignment_id = 1 AND question_id = 1`
    );
    expect(result.rows).toEqual([
      {
        student_username: "u1",
        assignment_id: 1,
        question_id: 1,
        answer: "Answer",
      },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
      await Submission.create(newSubmission);
      await Submission.create(newSubmission);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});


/*********** addFeedback */

describe("addFeedback", function () {
  const feedback = "Great job!";

  test("works", async function () {
    let submission = await Submission.addFeedback(1, feedback);
    expect(submission.feedback).toBe(feedback);

    const result = await db.query(
      `SELECT feedback
       FROM submissions
       WHERE id = 1`
    );
    expect(result.rows).toEqual([
      {
        feedback: feedback,
      },
    ]);
  });

  test("not found", async function () {
    try {
      await Submission.addFeedback(999, feedback);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});