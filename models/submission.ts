import { aN } from "vitest/dist/reporters-yx5ZTtEV";
import db from "../db";
import { NotFoundError } from "../expressError";
import { studentExists, assignmentExists } from "./helpers/dbHelpers";
/**
 * Submission model for creating, updating, and retrieving submissions.
 */

class Submission {
  /**
   * Creates a new submission and updates db
   * @param {SubmissionDataToCreate}data - The submission data
   * @returns {SubmissionData | null}The created Submission
   */
  static async create(data: SubmissionDataToCreate):
    Promise<SubmissionData | null>{
    const{ studentUsername, assignmentId, questionId, answer } = data;

    const existingSubmission = await db.query(`
      SELECT id
      FROM submissions
      WHERE student_username = $1 AND assignment_id = $2 AND question_id = $3 AND answer = $4`,
     [studentUsername, assignmentId, questionId, answer]
    );
    if(existingSubmission.rows[0]){
      return null; //handle client-side
    }

    const result = await db.query(`
      INSERT INTO submissions
        (student_username, assignment_id, question_id, answer)
      VALUES ($1, $2, $3, $4)
      RETURNING id,
                student_username AS "studentUsername",
                assignment_id AS "assignmentId",
                question_id AS "questionId",
                answer`,
              [studentUsername, assignmentId, questionId, answer]
    );
    const submission = result.rows[0];

    return submission;
  }

  /**
   * Adds feedback to a submission
   * @param {number} id - The ID of the submission
   * @param {string} feedback - The feedback to add
   * @returns {SubmissionData} - The updated submission
   * @throws {NotFoundError} - if submission id not found
   * TODO: what do I want this to return? Currently returning feedback
   */
  static async addFeedback(id: number, feedback: string):
    Promise<{feedback: string}> {

      const result = await db.query(`
        UPDATE submissions
        SET feedback = $1
        WHERE id = $2
        RETURNING feedback`,
              [feedback, id]
      );
      const submissionFeedback = result.rows[0];

      if(!submissionFeedback)
        throw new NotFoundError(`No submission with id: ${id}`);

      return submissionFeedback;
  }

  /**
   * Retrieves submissions by student
   * @param {string} studentUsername - The username of the student
   * @returns {SubmissionData[]} - A list of submissions by the student
   * @throws {NotFoundError} - if student not found
   *
   */
  static async getSubmissionsByStudent(studentUsername: string):
    Promise<SubmissionData[]> {

      if(!(await studentExists(studentUsername))){
        throw new NotFoundError(`Student ${studentUsername} not found`);
      }

      const result = await db.query(`
        SELECT id,
               student_username AS "studentUsername",
               assignment_id AS "assignmentId",
               question_id AS "questionId",
               answer,
               feedback
        FROM submissions
        WHERE student_username = $1`,
      [studentUsername]
    );
    const submissions = result.rows;

    return submissions;
  }

  /**
   * Retrieves submissions by assignment
   * @param {number} assignmentId - The ID of the assignment
   * @returns {SubmissionData[]} - A list of submissions for the assignment
   * @throws {NotFoundError} - if assignment not found
   */
  static async getSubmissionsByAssignment(assignmentId: number):
    Promise<SubmissionData[]> {

      if(!(await assignmentExists(assignmentId))){
        throw new NotFoundError(`Assignment ${assignmentId} not found`);
      }

      const result = await db.query(`
        SELECT id,
              student_username AS "studentUsername",
              assignment_id AS "assignmentId",
              question_id AS "questionId",
              answer,
              feedback
      FROM submissions
      WHERE assignment_id = $1`,
      [assignmentId]
    );
    const submissions = result.rows;

    return submissions;

  }

  /**
   * Retrieves submissions by student and assignment
   * @param studentUsername - The username of the student
   * @param assignmentId - The ID of the assignment
   * @returns The submissions for the student and assignment
   * @throws {NotFoundError} - if student or assignment not found
   */
  static async getSubmissionsByStudentAndAssignment(studentUsername: string, assignmentId: number): Promise<SubmissionData> {
  }
}
type SubmissionDataToCreate = {
  studentUsername: string;
  assignmentId: number;
  questionId: number;
  answer: string;
  feedback?: string;
};

type SubmissionData = {
  id: number;
  studentUsername: string;
  assignmentId: number;
  questionId: number;
  answer: string;
  feedback?: string;
};

export default Submission;