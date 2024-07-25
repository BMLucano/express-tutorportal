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
  testAssignmentIds,
  testQuestionIds,
} from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/************ create */

describe("create", function () {

  test("works", async function () {
    const newSubmission = {
      studentUsername: "u1",
      assignmentId: testAssignmentIds[0],
      questionId: testQuestionIds[0],
      answer: "Answer",
    };

    let submission = await Submission.create(newSubmission);
    expect(submission).toEqual({
      ...newSubmission,
      id: expect.any(Number),
    });

    const result = await db.query(
      `SELECT id, student_username, assignment_id, question_id, answer
       FROM submissions
       WHERE student_username = 'u1' AND assignment_id = $1 AND question_id = $2 AND answer = 'Answer'`,
      [testAssignmentIds[0], testQuestionIds[0]],
    );
    expect(result.rows[0]).toEqual(
      {
        id: expect.any(Number),
        student_username: "u1",
        assignment_id: testAssignmentIds[0],
        question_id: testQuestionIds[0],
        answer: "Answer",
      },
    );
  });

  test("null return with dupe", async function () {
    const newSubmission = {
      studentUsername: "u1",
      assignmentId: testAssignmentIds[0],
      questionId: testQuestionIds[0],
      answer: "Answer",
    };

    await Submission.create(newSubmission);
    const dupeSubmission = await Submission.create(newSubmission);
    expect(dupeSubmission).toEqual(null);
  });
});


/*********** addFeedback */
//TODO: should this return the feedback, entire submission, or a boolean?
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


/*********** getSubmissionByStudent */

describe("getSubmissionByStudent", function() {
  test("works", async function() {
    let submissions = await Submission.getSubmissionsByStudent("u1");
    expect(submissions).toEqual([{
      studentUsername: "u1",
      assignmentId: 1,
      questionId: 1,
      answer: "not answered",
    }]);
  })

  test("not found", async function () {
    try{
      await Submission.getSubmissionsByStudent("u3");
      throw new Error("fail test, you shouldn't get here");
    }catch(err){
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/********* getSubmissionsByAssignment */

describe("getSubmissionByAssignment", function() {
  test("works", async function() {
    let submissions = await Submission.getSubmissionsByAssignment(1);
    expect(submissions).toEqual([{
      studentUsername: "u1",
      assignmentId: 1,
      questionId: 1,
      answer: "not answered",
    }]);
  })

  test("not found", async function () {
    try{
      await Submission.getSubmissionsByAssignment(999);
      throw new Error("fail test, you shouldn't get here");
    }catch(err){
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/********** getSubmissionsByStudentAndAssignment */

describe("getSubmissionByStudentAndAssignment", function() {
  test("works", async function() {
    let submissions = await Submission.getSubmissionsByStudentAndAssignment("u1", 1);
    expect(submissions).toEqual([{
      studentUsername: "u1",
      assignmentId: 1,
      questionId: 1,
      answer: "not answered",
    }]);
  })

  test("student not found", async function () {
    try{
      await Submission.getSubmissionsByStudentAndAssignment("u3", 1);
      throw new Error("fail test, you shouldn't get here");
    }catch(err){
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("assignment not found", async function () {
    try{
      await Submission.getSubmissionsByStudentAndAssignment("u1", 999);
      throw new Error("fail test, you shouldn't get here");
    }catch(err){
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});