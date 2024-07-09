
/**Functions for user model */

class User {

  /** Authenticate a user with usename and password
   *
   * @param {string} username
   * @param {string} password
   *
   * Returns { username, firstName, lastName, email, role }
   *
   * Throws UnauthorizedError if user is not found or wrong password.
   */


  /** Register a user with new data.
   *
   * @param {string} username
   * @param {string} password
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} email
   * @param {string} role
   *
   * Returns { username, firstName, lastName, email, role }
   *
   * Throws BadRequestError for duplicates.
   */


  /** Find all users.
   *
   * Returns list of all user data: [{ username, firstName, lastName, email, role }...]
   */


  /**Given a username, return data about that user.
   *
   * @param {string} username
   *
   * Returns { username, firstName, lastName, email, role}
   *
   * Throws NotFoundError if user not found.
   */


  //TODO: functions for updating data and resetting password?
}

export default User;