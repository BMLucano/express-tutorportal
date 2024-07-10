
/**
 * Submission model for creating, updating, and retrieving submissions.
 */

class Submission {
  /**
   * Creates a new submission and updates db
   * @param {SubmissionData }data - The submission data
   * @returns The created Submission
   */
  static async create(data: SubmissionData): Promise<SubmissionData> {
  }

/**
 * Adds feedback to a submission
 * @param id - The ID of the submission
 * @param feedback - The feedback to add
 * @returns Promise<SubmissionData> - The updated submission
 * @throws {NotFoundError} - if submission id not found
 */
static async addFeedback(id: number, feedback: string): Promise<SubmissionData> {
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
   * Retrieves a submission by student and assignment
   * @param studentUsername - The username of the student
   * @param assignmentId - The ID of the assignment
   * @returns The submission for the student and assignment
   * @throws {NotFoundError} - if student or assignment not found
   */
  async getSubmissionByStudentAndAssignment(studentUsername: string, assignmentId: number): Promise<SubmissionData> {
  }
}

type SubmissionData = {
  id?: number;
  studentUsername: string;
  assignmentId: number;
  questionId: number;
  answer: string;
  feedback?: string;
};