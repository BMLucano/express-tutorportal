import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config";


/** Create token for user.
 *
 * @param {username, role} - user data
 * @returns {string} - signed JWT {username, role}
 */

function createToken(username: string, role: string): string{

  let payload = {
    username: username,
    role: role,
  }
  console.log("payload in createToken", payload)
  return jwt.sign(payload, SECRET_KEY);
}

// type UserData = {
//   username: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: string;
// };

export {createToken};