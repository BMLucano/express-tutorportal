import db from "../db";
import bcrypt from "bcrypt";
import { BCRYPT_WORK_FACTOR } from "../config";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError
} from "../expressError";
import { studentExists } from "./helpers/dbHelpers";

import { AssignmentData } from "./assignment";
import AssignmentStudent from "./assignmentStudent";
import Session, { SessionData }from "./session";
import Resource, { ResourceData } from "./resource";
import Note, {NoteData} from "./note";

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
   * @param {RegisterUserData} - data necessary to register a new user
   * @returns {UserData} - Created user data
   * @throws {BadRequestError} - for duplicates
   */
  static async register(
    { username, password, firstName, lastName, email,role}: RegisterUserData):
    Promise<UserData> {

    const duplicateCheck = await db.query(`
      SELECT username
      FROM users
      WHERE username = $1`, [username]
    );
    if(duplicateCheck.rows.length > 0){
      throw new BadRequestError(`Duplicate username: ${username}`)
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(`
      INSERT INTO users
      (username,
      password,
      first_name,
      last_name,
      email,
      role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING username,
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                role `, [
                  username, hashedPassword, firstName, lastName, email, role
                ]);
    const user = result.rows[0];

    return user;
  }


  /**
   * Find all users.
   *
   * @returns {User[]} - List of all user data
   */
  static async getAll(): Promise<UserData[]> {
    const result = await db.query(`
      SELECT username,
             first_name AS "firstName",
             last_name AS "lastName",
             email,
             role
      FROM users
      ORDER BY username`);

      return result.rows;
  }


  /**
   * Get user data by username.
   *
   * @param {string} username
   *
   * @returns {User} - User data
   *
   * @throws NotFoundError - if user not found
   */
  static async get(username: string): Promise<UserData> {

    const result = await db.query(`
      SELECT username,
             first_name AS "firstName",
             last_name AS "lastName",
             email,
             role
        FROM users
        WHERE username = $1`, [username],
      );
    const user = result.rows[0];

    if(!user) throw new NotFoundError(`User not found: ${username} `);

    return user;
  }

  /** Given a username, get dashboard data by calling assignment,
   * resource, session, and message models.
   * @param {string} studentUsername
   * @returns {DashboardData} - recent data for student dashboard
   * @throws {NotFoundError} - if student not found
   *
  */

  static async getUserDashboard(studentUsername: string, limit: number = 3):
    Promise<DashboardData> {

      if(!(await studentExists(studentUsername)))
        throw new NotFoundError(`No student with username ${studentUsername}`)

    const user = await User.get(studentUsername);
    const nextSession = await Session.getSessionsByStudent(studentUsername);
    const assignments = await AssignmentStudent.getAssignmentsByStatus('assigned',
      studentUsername);
    const resources = await Resource.getResourcesByStudent(studentUsername);
    const notes = await Note.getNotesByStudent(studentUsername);
    // const unreadMessages = await Message.getUnreadMessages(username);
    console.log("user from model", user)

    return {
      user,
      nextSession: nextSession[0],
      recentAssignments: assignments.slice(0, limit),
      recentResources: resources.slice(0, limit),
      recentNotes: notes.slice(0, limit),
      // unreadMessages,
    };
  }
  //TODO: functions for updating data and resetting password?
}

type DashboardData = {
  user: UserData,
  nextSession: SessionData,
  recentAssignments: AssignmentData[],
  recentResources: ResourceData[],
  recentNotes: NoteData[],

}

type UserData = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

type RegisterUserData = {
  username: string;
  password: string,
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default User;