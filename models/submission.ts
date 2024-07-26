import { aN } from "vitest/dist/reporters-yx5ZTtEV";
import db from "../db";
import { NotFoundError } from "../expressError";
/**
 * Submission model for creating, updating, and retrieving submissions.
 */

class Submission {
  /**
   * Creates a new submission and updates db
   * @param {SubmissionDataToCreate }data - The submission data
   * @returns The created Submission
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
   * @param id - The ID of the submission
   * @param feedback - The feedback to add
   * @returns Promise<SubmissionData> - The updated submission
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
   * @param studentUsername - The username of the student
   * @returns A list of submissions by the student
   * @throws {NotFoundError} - if student not found
   *
   */
  static async getSubmissionsByStudent(studentUsername: string): Promise<SubmissionData[]> {
  }

  /**
   * Retrieves submissions by assignment
   * @param assignmentId - The ID of the assignment
   * @returns A list of submissions for the assignment
   * @throws {NotFoundError} - if assignment not found
   */
  static async getSubmissionsByAssignment(assignmentId: number): Promise<SubmissionData[]> {
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
  id?: number;
  studentUsername: string;
  assignmentId: number;
  questionId: number;
  answer: string;
  feedback?: string;
};

export default Submission;