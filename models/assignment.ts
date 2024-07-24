import db from "../db";
import { NotFoundError, BadRequestError } from "../expressError";
import { sqlForPartialUpdate } from "./helpers/sql";

/**
 * Assignment model functions for creating, updating, deleting, and retrieving assignments.
 */
class Assignment {
  /**
   * Create an assignment from given data, update db, return new assignment data.
   *
   * @param {AssignmentDataToCreate} data - Assignment data to create
   * @returns {AssignmentData} - Created assignment
   * @throws {BadRequestError} - if assignment already exists in db
   */
  static async create(data: AssignmentDataToCreate): Promise<AssignmentData> {
    const { title, description, dueDate } = data;

    const dupCheck = await db.query(`
      SELECT id
      FROM assignments
      WHERE title = $1`, [title]
    );
    if(dupCheck.rows[0])
      throw new BadRequestError(`Duplicate assignment: ${title}`);

    const result = await db.query(`
      INSERT INTO assignments (title, description, due_date)
      VALUES ($1, $2, $3)
      RETURNING id, title, description, TO_CHAR(due_date, 'YYYY-MM-DD') AS "dueDate"`,
    [title, description, dueDate]
    );
    const assignment = result.rows[0];
    console.log("assignment date", assignment.dueDate)

    return assignment;
  }

  /**
   * Update assignment with partial data.
   *
   * @param {Partial<AssignmentDataToUpdate>} data - Partial assignment data to update
   * @param {number} id - Assignment id to update
   * @returns {AssignmentData} - Updated assignment
   * @throws {NotFoundError} - if assignment not found
   */
  static async update(id: number, data: Partial<AssignmentDataToUpdate>):
  Promise<AssignmentData> {

    const { sqlSetCols, values } = sqlForPartialUpdate(
      data,
      {dueDate: "due_date"},
    );
    const idSanitationIdx = "$" + (values.length + 1);

    const result = await db.query(`
      UPDATE assignments
      SET ${sqlSetCols}
      WHERE id = ${idSanitationIdx}
      RETURNING id, title, description, TO_CHAR(due_date, 'YYYY-MM-DD') AS "dueDate"`,
    [...values, id]
    );
    const assignment = result.rows[0];
    console.log("assignment", assignment)
    if(!assignment)
      throw new NotFoundError(`No assignment found with id: ${id} `);

    return assignment;
  }

  /**
   * Delete an assignment from database by id.
   *
   * @param {number} id - Assignment id to delete
   * @returns {undefined}
   * @throws {NotFoundError} - if assignment not found
   */
  static async delete(id: number): Promise<void> {
    const result = await db.query(`
      DELETE
      FROM assignments
      WHERE id = $1
      RETURNING id`, [id]
    );
    const assignment = result.rows[0];

    if(!assignment)
      throw new NotFoundError(`No assignment found with id: ${id}`)
  }

 /**
   * Get a single assignment by id, including questions.
   *
   * @param {number} id - Assignment id to retrieve
   * @returns {AssignmentDataWithQuestions} - Retrieved assignment with questions
   * @throws {NotFoundError} - if assignment not found
   */
  static async get(id: number): Promise<AssignmentDataWithQuestions> {
    const result = await db.query(`
      SELECT id, title, description, TO_CHAR(due_date, 'YYYY-MM-DD') AS "dueDate"
      FROM assignments
      WHERE id = $1`, [id]);
    const assignment = result.rows[0];

    if(!assignment)
      throw new NotFoundError(`No assignment found with id: ${id}`);

    const questionsResult = await db.query(`
      SELECT id,
            assignment_id AS "assignmentId",
            question_text AS "questionText",
            answer_text AS "answerText"
      FROM questions
      WHERE assignment_id = $1`, [assignment.id]);
      const questions = questionsResult.rows;

      assignment.questions = questions;
      return assignment;
  }

  /**
   * Get all assignments, including questions.
   *
   * @returns {AssignmentDataWithQuestions[]} - Retrieved assignments with questions
   */
  static async getAll(): Promise<AssignmentDataWithQuestions[]> {}


}

type AssignmentDataToCreate = {
  title: string;
  description: string;
  dueDate: string;
};

type AssignmentDataToUpdate = {
  title?: string | null;
  description?: string | null;
  dueDate?: string | null;
};

type AssignmentData = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
};

type AssignmentDataWithQuestions = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  questions: QuestionData[];
};

export default Assignment;