import db from "../db";
import { NotFoundError, BadRequestError } from "../expressError";
import { studentExists, assignmentExists } from "./helpers/dbHelpers";
import Assignment from "./assignment";
import User from "./user";

/**
 * Student assignment model for handling the assignment to student relationship.
 */

class AssignmentStudent {
  /**
   * TODO: Do i want this to return a boolean instead??
   * Assign a student to an assignment, given a student username and assignment id.
   *
   * @param {string} studentUsername
   * @param {number} assignmentId
   * @returns {AssignmentStudent} - The updated assignment-student relationship
   */
  static async assign(studentUsername: string, assignmentId: number):
  Promise<AssignmentStudentData> {
    if(!(await studentExists(studentUsername))){
      throw new NotFoundError(`Student ${studentUsername} not found`)
    }

    if(!(await assignmentExists(assignmentId))){
      throw new NotFoundError(`Assignment ${assignmentId} not found`)
    }

    const result = await db.query(`
      INSERT INTO assignments_students (assignment_id, student_username)
      VALUES ($1, $2)
      RETURNING id,
                assignment_id AS "assignmentId",
                student_username AS "studentUsername",
                status`,
              [assignmentId, studentUsername]
    );
    const assignmentStudent = result.rows[0];

    if(!assignmentStudent)
      throw new BadRequestError("Failed to create assignment-student realtionship");

    return assignmentStudent;
  }

  /**
   * TODO: Do i want this to return a boolean instead??
   * Updates status of assignment to 'in progress' or 'completed'
   *
   * @param {string} studentUsername
   * @param {number} assignmentId
   * @param {string} status
   * @returns {AssignmentStudent} - The updated assignment-student relationship
   */
  static async updateStatus(
    studentUsername: string, assignmentId: number, status: string):
    Promise<AssignmentStudentData> {

      if(!(await studentExists(studentUsername))){
        throw new NotFoundError(`Student ${studentUsername} not found`)
      }

      if(!(await assignmentExists(assignmentId))){
        throw new NotFoundError(`Assignment ${assignmentId} not found`)
      }

      const result = await db.query(`
        UPDATE assignments_students
        SET status = $1
        WHERE student_username = $2 AND assignment_id = $3
        RETURNING id,
                  student_username AS "studentUsername",
                  assignment_id AS "assignmentId",
                  status`,
      [status, studentUsername, assignmentId],
      );
      const assignmentStudent = result.rows[0];

      return assignmentStudent;

    }

  /**
   * Get all assignments based on student username.
   *
   * @param {string} studentUsername
   * @returns {AssignmentData[]} - Retrieved assignments
   * @throws {NotFoundError} - if student not found
   *  TODO://possibly need error for no assignments found
   */
  static async getAssignmentsByStudent(studentUsername: string):
  Promise<AssignmentData[]> {

    if(!(await studentExists(studentUsername))){
      throw new NotFoundError(`Student ${studentUsername} not found`)
    }

    //order results by due date
    const result = await db.query(`
      SELECT assignment_id AS "assignmentId"
      FROM assignments_students
      JOIN assignments ON assignments_students.assignment_id = assignments.id
      WHERE assignments_students.student_username = $1
      ORDER BY assignments.due_date DESC`,
      [studentUsername]
    )
    const assignments = result.rows;

    // if(assignments.length === 0)
    //   throw new NotFoundError(`No assignments found for student: ${studentUsername}`);

    //using Promises to handle async fetching of assignment data
    const assignmentPromises = assignments.map(async (a) => {
      return await Assignment.get(a.assignmentId);
    })
    const assignmentData = await Promise.all(assignmentPromises);

    return assignmentData;
  }

    /**
   * Get assignments by status and student.
   * (use for dashboard - get 'assigned' assignments to include)
   *
   * @param {string} status - Assignment status to filter by
   * @param {string} studentUsername - Student username to retrieve assignments for
   * @returns {AssignmentData[]} - Retrieved assignments
   * @throws {NotFoundError} - if no student found
   */
    static async getAssignmentsByStatus(
      status: string,
      studentUsername: string
    ): Promise<AssignmentData[]> {

      if(!(await studentExists(studentUsername)))
      throw new NotFoundError(`Student ${studentUsername} not found`);

      //order results by due_date
      const results = await db.query(`
        SELECT assignment_id AS "assignmentId"
        FROM assignments_students
        JOIN assignments ON assignments_students.assignment_id = assignments.id
        WHERE assignments_students.student_username = $1 AND status = $2
        ORDER BY assignments.due_date DESC`,
      [studentUsername, status]);
      const assignments = results.rows;

      const assignmentPromises = assignments.map(async (a) =>{
        return await Assignment.get(a.assignmentId);
      });
      const assignmentData = await Promise.all(assignmentPromises);

      return assignmentData;
    }

  /**
   * Get all Students that an assignment is assigned to, based on assignment id.
   *
   * @param {number} assignmentId
   * @returns {User[]} - List of student User objects
   * @throws {NotFoundError} - if assignment id not found
   */
  static async getStudentsByAssignment(assignmentId: number): Promise<User[]> {

    if(!(await assignmentExists(assignmentId))){
      throw new NotFoundError(`Assignment ${assignmentId} not found`)
    }

    const result = await db.query(`
      SELECT student_username AS "studentUsername"
      FROM assignments_students
      JOIN users ON users.username = assignments_students.student_username
      WHERE assignments_students.assignment_id = $1
      ORDER BY users.first_name`,
    [assignmentId]);
    const students = result.rows;

    const studentPromises = students.map(async (s) => {
      return await User.get(s.studentUsername);
    });
    const studentData = await Promise.all(studentPromises);

    return studentData;
  }
}

type AssignmentData = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  questions: QuestionData[];
};

type User = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

type AssignmentStudentData = {
  id: number;
  assignmentId: number;
  studentUsername: string;
  status: string;
};

export default AssignmentStudent;