
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
  static async create(data: QuestionDataToCreate): Promise<QuestionData> {}

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
  static async update(id: number, data: Partial<QuestionDataToUpdate>): Promise<QuestionData> {}

  /**
   * Delete a question from database by id.
   *
   * @param {number} id - Question id to delete
   *
   * @returns {undefined}
   *
   * @throws {NotFoundError} - if question not found
   */
  static async delete(id: number): Promise<void> {}

  /**
   * Get all Questions by assignment id.
   *
   * @param {number} assignmentId
   *
   * @returns {QuestionData[]} - Array of all questions
   *
   * @throws {NotFoundError} - if assignment not found
   */
  static async getAllByAssignmentId(assignmentId: number): Promise<QuestionData[]> {}
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

type QuestionData = {
  id: number;
  assignmentId: number;
  questionText: string;
  answerText: string;
};

export default Question;
