/** Routes for authentication. */
import express from "express";

const router = express.Router();


/** POST /auth/token: { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization req: none
*/

/** POST auth/register: { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email, role}
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 *
 */

export default router;