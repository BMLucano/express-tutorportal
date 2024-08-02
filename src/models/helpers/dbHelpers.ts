import db from "../../db";
/**
 * Helper functions for checking if rows exists in the database
 */


/**
 * Cecks if a student exists.
 *
 * @param {string} - username
 * @returns {boolean} -True if student exists, false in not
 */
async function studentExists(username: string): Promise<boolean>{
  const result = await db.query(`
    SELECT username FROM users WHERE username = $1`,
    [username]
  );
  return result.rows[0];
}

/**
 * Cecks if as assignment exists.
 *
 * @param {number} - assignment id
 * @returns {boolean} -True if assignment exists, false in not
 */
async function assignmentExists(id: number): Promise<boolean>{
  const result = await db.query(`
    SELECT id FROM assignments WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

export {studentExists, assignmentExists}