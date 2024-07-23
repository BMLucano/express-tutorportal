import db from "../db";
import bcrypt from "bcrypt";
import { BCRYPT_WORK_FACTOR } from "../config";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError
} from "../expressError";

/** Functions for user model */

class User {

  /**
   * Authenticate a user with username and password.
   *
   * @param {string} username
   * @param {string} password
   *
   * @returns {UserData} - Authenticated user data
   *
   * @throws UnauthorizedError - if user is not found or wrong password
   */
  static async authenticate(username: string, password: string): Promise<UserData> {

    const result = await db.query(`
        SELECT username,
              password,
              first_name AS "firstName",
              last_name AS "lastName",
              email,
              role
        FROM users
        WHERE username = $1`, [username],
      );

    const user = result.rows[0];

    if(user) {

      const isValid = await bcrypt.compare(password, user.password);
      if(isValid === true) {
        delete user.password;
        return user;
      }
    }
    throw new UnauthorizedError("Invalid username/password");
  }


  /**
   * Register a user with new data.
   *
   * @param {string} username
   * @param {string} password
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} email
   * @param {string} role
   *
   * @returns {UserData} - Created user data
   *
   * @throws BadRequestError - for duplicates
   */
  static async register(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string
  ): Promise<UserData> {}


  /**
   * Find all users.
   *
   * @returns {User[]} - List of all user data
   */
  static async getAll(): Promise<UserData[]> {}


  /**
   * Get user data by username.
   *static
   * @param {string} username
   *
   * @returns {User} - User data
   *
   * @throws NotFoundError - if user not found
   */
  static async get(username: string): Promise<UserData> {}

  //TODO: figure out what to do with this function
  /** Given a username, get dashboard data by calling assignment,
   * resource, session, and message models.
   * @param {string} username
   *
   * Returns
  */

  // async getUserDashboard(username) {
  //   const user = await User.get(username);
  //   const nextSession = await Session.getNextSession(username);
  //   const recentAssignments = await Assignment.getAssignmentsByStatus(username, 'assigned');
  //   const recentResources = await Resource.getRecentResources(username);
  //   const unreadMessages = await Message.getUnreadMessages(username);

  //   return {
  //     user,
  //     nextSession,
  //     recentAssignment,
  //     recentResources,
  //     unreadMessages,
  //   };
  // }
  //TODO: functions for updating data and resetting password?
}

type UserData = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export default User;