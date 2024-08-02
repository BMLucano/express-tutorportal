import db from "../db";
import { BadRequestError, NotFoundError } from "../expressError";
import { sqlForPartialUpdate } from "./helpers/sql";
import { assignmentExists } from "./helpers/dbHelpers";
/**
 * Question model for creating, updating, deleting, and retrieving questions.
 */

class Question {
  /**
   * Create a question from given data, update db, and return new question.
   *
   * @param {QuestionDataToCreate} data - Question data to create
   *
   * @returns {QuestionData} - Created question
   *
   * @throws {BadRequestError} - if question already exists in db
   */
  static async create(data: QuestionDataToCreate): Promise<QuestionData> {

    const {assignmentId, questionText, answerText } = data;

    const dupeCheck = await db.query(`
      SELECT id
      FROM questions
      WHERE question_text = $1`,
    [questionText],
    );
    if(dupeCheck.rows[0])
      throw new BadRequestError(`Duplicate question: ${questionText}`);

    const result = await db.query(`
      INSERT INTO questions(assignment_id, question_text, answer_text)
      VALUES ($1, $2, $3)
      RETURNING id,
                assignment_id AS "assignmentId",
                question_text AS "questionText",
                answer_text AS "answerText"`,
              [assignmentId, questionText, answerText]
    );
    const question = result.rows[0];

    return question;
  }

  /**
   * Update question with partial data.
   *
   * @param {number} id
   * @param {Partial<QuestionDataToUpdate>} data - Partial question data to update
   *
   * @returns {QuestionData} - Updated question
   *
   * @throws {NotFoundError} - if question not found
   */
  static async update(id: number, data: Partial<QuestionDataToUpdate>):
    Promise<QuestionData> {

      const { sqlSetCols, values } = sqlForPartialUpdate(
        data,
        {assignmentId: "assignment_id",
          questionText: "question_text",
          answerText: "answer_text",
        }
      );
      const idSanitationIdx = "$" + (values.length + 1);

      const result = await db.query(`
        UPDATE questions
        SET ${sqlSetCols}
        WHERE id = ${idSanitationIdx}
        RETURNING id,
                assignment_id AS "assignmentId",
                question_text AS "questionText",
                answer_text AS "answerText"`,
              [...values, id]
      );
      const question = result.rows[0];

      if(!question)
        throw new NotFoundError(`No question found with id: ${id}`);

      return question;
    }

  /**
   * Delete a question from database by id.
   *
   * @param {number} id - Question id to delete
   *
   * @returns {undefined}
   *
   * @throws {NotFoundError} - if question not found
   */
  static async delete(id: number): Promise<void> {

    const result = await db.query(`
      DELETE FROM questions WHERE id = $1 RETURNING id`,
    [id]
    );
    const question = result.rows[0];

    if(!question)
      throw new NotFoundError(`No question found with id: ${id}`);
  }

  /**
   * TODO: do I need this? Already getting all questions when getting Assignment
   * Get all Questions by assignment id.
   *
   * @param {number} assignmentId
   *
   * @returns {QuestionData[]} - Array of all questions
   *
   * @throws {NotFoundError} - if assignment not found
   */
  static async getAllByAssignmentId(assignmentId: number):
    Promise<QuestionData[]> {

      if(!(await assignmentExists(assignmentId))){
        throw new NotFoundError(`No assignment found with id: ${assignmentId}`);
      }

      const result = await db.query(`
        SELECT id,
               assignment_id AS "assignmentId",
               question_text AS "questionText",
               answer_text AS "answerText"
        FROM questions
        WHERE assignment_id = $1`,
      [assignmentId]
      );
      const questions = result.rows;

      return questions;
    }
}

type QuestionDataToCreate = {
  assignmentId: number;
  questionText: string;
  answerText: string;
};

type QuestionDataToUpdate = {
  assignmentId?: number | null;
  questionText?: string | null;
  answerText?: string | null;
};

export type QuestionData = {
  id: number;
  assignmentId: number;
  questionText: string;
  answerText: string;
};

export default Question;
