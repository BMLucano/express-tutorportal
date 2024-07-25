import { describe, test, it, expect } from "vitest";
import { NotFoundError, BadRequestError } from "../expressError";

import db from "../db";
import User from "./user";
import Assignment from "./assignment";
import Question from "./question";

import { afterAll, beforeAll } from "vitest";
import { afterEach, beforeEach } from "vitest";
import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testAssignmentIds,
  testQuestionIds
} from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**************** create */
describe("create", function(){

  test("works", async function(){
    const newQuestion = {
      assignmentId: testAssignmentIds[0],
      questionText: "New Question",
      answerText: "New Answer",
    };

    const question = await Question.create(newQuestion);
    expect(question).toEqual({
      ...newQuestion,
      id: expect.any(Number),
    });

    const result = await db.query(`
      SELECT assignment_id, question_text, answer_text
      FROM questions
      WHERE question_text = 'New Question' `)
    expect(result.rows[0]).toEqual({
      assignment_id: testAssignmentIds[0],
      question_text: "New Question",
      answer_text: "New Answer",
    });
  });

  test("bad request with dupe", async function(){
    const newQuestion = {
      assignmentId: testAssignmentIds[0],
      questionText: "New Question",
      answerText: "New Answer",
    };

    try{
      await Question.create(newQuestion);
      await Question.create(newQuestion);
      throw new Error("fail test, you shouldn't get here")
    }catch(err){
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

})
/**************** update */
describe("update", function(){
  const updateData = {
    questionText: "Updated Question",
    answerText: "Updated Answer",
  }
  test("works", async function(){
    const question = await Question.update(testQuestionIds[0], updateData);
    expect(question).toEqual({
      ...updateData,
      id: testQuestionIds[0],
      assignmentId: testAssignmentIds[0],
    });

    const result = await db.query(`
      SELECT id, assignment_id, question_text, answer_text
      FROM questions
      WHERE id = $1`, [testQuestionIds[0]]);
    expect(result.rows[0]).toEqual({
      id: testQuestionIds[0],
      assignment_id: testAssignmentIds[0],
      question_text: "Updated Question",
      answer_text: "Updated Answer",
    })
  });

  test("not found if no such question", async function () {
    try {
      await Question.update(999, updateData);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Question.update(1, {});
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
})
/**************** delete */

describe("delete", function () {
  test("works", async function () {
    //Create a new question
    const result = await db.query(`
      INSERT INTO questions (assignment_id, question_text, answer_text)
      VALUES ($1, 'Test Question', 'This is a test')
      RETURNING id
      `, [testAssignmentIds[0]]);
    const questionId = result.rows[0].id;

    //delete the question
    await Question.delete(questionId);

    const deletedResult = await db.query(`
      SELECT * FROM questions WHERE id = $1`,
      [questionId]
    );
    expect(deletedResult.rows).toEqual([]);
  });

  test("not found", async function () {
    try {
      await Question.delete(999);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
/**************** getAllByAssignmentId */

describe("getAllByAssignmentId", function () {
  test("works", async function () {
    let questions = await Question.getAllByAssignmentId(testAssignmentIds[0]);
    expect(questions).toEqual([
      {
        id: testQuestionIds[0],
        assignmentId: testAssignmentIds[0],
        questionText: "Question1",
        answerText: "Answer1",
      },
    ]);
  });

  test("not found if no assignment", async function () {
    try {
      await Question.getAllByAssignmentId(999);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

