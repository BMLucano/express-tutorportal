/** Shared config for application; can be required many places. */

import dotenv from 'dotenv';
import colors from 'colors';
import process from 'node:process';

dotenv.config();

const SECRET_KEY: string = process.env.SECRET_KEY || 'secret-dev';

const PORT: number = parseInt(process.env.PORT as string, 10) || 3001;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri(): string {
  return (process.env.NODE_ENV === 'test')
    ? 'postgresql:///tutorportal_test'
    : process.env.DATABASE_URL || 'postgresql:///tutorportal';
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
const BCRYPT_WORK_FACTOR: number = process.env.NODE_ENV === 'test' ? 1 : 12;

if (process.env.NODE_ENV !== 'test') {
  console.log(`
${"Jobly Config:".green}
${"NODE_ENV:".yellow}           ${process.env.NODE_ENV}
${"SECRET_KEY:".yellow}         ${SECRET_KEY}
${"PORT:".yellow}               ${PORT}
${"CRYPT_WORK_FACTOR:".yellow} ${BCRYPT_WORK_FACTOR}
${"Database:".yellow}           ${getDatabaseUri()}
---`);
}

export {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};