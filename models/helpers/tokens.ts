import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config";


/** Create token for user.
 *
 * @param {username, firstName, lastName, email, role} - user data
 * @returns {string} - signed JWT {username, role}
 */

function createToken(user: UserData): string{

}

type UserData = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};