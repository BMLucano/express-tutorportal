import db from "../db";
import { NotFoundError, BadRequestError } from "../expressError";

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
      RETURNING id, title, description, due_date AS "dueDate"`,
    [title, description, dueDate]
    );
    const assignment = result.rows[0];

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
  static async update(id: number, data: Partial<AssignmentDataToUpdate>): Promise<AssignmentData> {}

  /**
   * Delete an assignment from database by id.
   *
   * @param {number} id - Assignment id to delete
   * @returns {undefined}
   * @throws {NotFoundError} - if assignment not found
   */
  static async delete(id: number): Promise<void> {}

 /**
   * Get a single assignment by id, including questions.
   *
   * @param {number} id - Assignment id to retrieve
   * @returns {AssignmentDataWithQuestions} - Retrieved assignment with questions
   * @throws {NotFoundError} - if assignment not found
   */
  static async get(id: number): Promise<AssignmentDataWithQuestions> {}

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
  dueDate: Date;
};

type AssignmentDataToUpdate = {
  title?: string | null;
  description?: string | null;
  dueDate?: Date | null;
};

type AssignmentData = {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
};

type AssignmentDataWithQuestions = {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  questions: QuestionData[];
};

export default Assignment;