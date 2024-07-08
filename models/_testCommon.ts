import bcrypt from 'bcrypt';
import db from '../db.js';
import { BCRYPT_WORK_FACTOR } from '../config';

const testUserIds: number[] = [];
const testAssignmentIds: number[] = [];
const testQuestionIds: number[] = [];
const testSubmissionIds: number[] = [];
const testNoteIds: number[] = [];
const testResourceIds: number[] = [];
const testSessionIds: number[] = [];
const testMessageIds: number[] = [];
const testAssignmentsStudentsIds: number[] = [];

async function commonBeforeAll() {
  // Delete data from all tables
  await db.query('DELETE FROM messages');
  await db.query('DELETE FROM sessions');
  await db.query('DELETE FROM resources');
  await db.query('DELETE FROM notes');
  await db.query('DELETE FROM submissions');
  await db.query('DELETE FROM questions');
  await db.query('DELETE FROM assignments_students');
  await db.query('DELETE FROM assignments');
  await db.query('DELETE FROM users');

  // Insert data into users table
  const resultsUsers = await db.query(`
    INSERT INTO users(username, password, first_name, last_name, email, role)
    VALUES ($1, $2, 'U1F', 'U1L', 'u1@email.com', 'student'),
           ($3, $4, 'U2F', 'U2L', 'u2@email.com', 'tutor')
    RETURNING id`, [
    await bcrypt.hash('password1', BCRYPT_WORK_FACTOR),
    await bcrypt.hash('password1', BCRYPT_WORK_FACTOR),
    await bcrypt.hash('password2', BCRYPT_WORK_FACTOR),
    await bcrypt.hash('password2', BCRYPT_WORK_FACTOR),
  ]);
  testUserIds.push(...resultsUsers.rows.map(({ id }) => id));

  // Insert data into assignments table
  const resultsAssignments = await db.query(`
    INSERT INTO assignments(title, description, due_date)
    VALUES ('Assignment1', 'Desc1', '2023-07-01'),
           ('Assignment2', 'Desc2', '2023-07-02')
    RETURNING id`);
  testAssignmentIds.push(...resultsAssignments.rows.map(({ id }) => id));

  // Insert data into assignments_students table
  const resultsAssignmentsStudents = await db.query(`
    INSERT INTO assignments_students(assignment_id, student_username)
    VALUES ($1, $2),
           ($3, $4)`, [
    testAssignmentIds[0],
    testUserIds[0],
    testAssignmentIds[1],
    testUserIds[1],
  ]);
  testAssignmentsStudentsIds.push(...resultsAssignmentsStudents.rows.map(({ id }) => id));

  // Insert data into questions table
  const resultsQuestions = await db.query(`
    INSERT INTO questions(assignment_id, question_text, answer_text)
    VALUES ($1, 'Question1', 'Answer1'),
           ($2, 'Question2', 'Answer2')`, [
    testAssignmentIds[0],
    testAssignmentIds[1],
  ]);
  testQuestionIds.push(...resultsQuestions.rows.map(({ id }) => id));

  // Insert data into submissions table
  const resultsSubmissions = await db.query(`
    INSERT INTO submissions(student_username, assignment_id, question_id, answer, feedback)
    VALUES ($1, $2, $3, 'not answered', 'No feedback'),
           ($4, $5, $6, 'not answered', 'No feedback')`, [
    testUserIds[0],
    testAssignmentIds[0],
    testQuestionIds[0],
    testUserIds[1],
    testAssignmentIds[1],
    testQuestionIds[1],
  ]);
  testSubmissionIds.push(...resultsSubmissions.rows.map(({ id }) => id));

  // Insert data into notes table
  const resultsNotes = await db.query(`
    INSERT INTO notes(student_username, title, content_path)
    VALUES ($1, 'Note1', 'path1'),
           ($2, 'Note2', 'path2')`, [
    testUserIds[0],
    testUserIds[1],
  ]);
  testNoteIds.push(...resultsNotes.rows.map(({ id }) => id));

  // Insert data into resources table
  const resultsResources = await db.query(`
    INSERT INTO resources(student_username, title, url, description)
    VALUES ($1, 'Resource1', 'url1', 'Desc1'),
           ($2, 'Resource2', 'url2', 'Desc2')`, [
    testUserIds[0],
    testUserIds[1],
  ]);
  testResourceIds.push(...resultsResources.rows.map(({ id }) => id));

  // Insert data into sessions table
  const resultsSessions = await db.query(`
    INSERT INTO sessions(student_username, date, time, duration, notes)
    VALUES ($1, '2023-07-01', '10:00', '01:00', 'Notes1'),
           ($2, '2023-07-02', '11:00', '02:00', 'Notes2')`, [
    testUserIds[0],
    testUserIds[1],
  ]);
  testSessionIds.push(...resultsSessions.rows.map(({ id }) => id));

  // Insert data into messages table
  const resultsMessages = await db.query(`
    INSERT INTO messages(sender_username, receiver_username, content)
    VALUES ($1, $2, 'Message1'),
           ($3, $4, 'Message2')`, [
    testUserIds[0],
    testUserIds[1],
    testUserIds[1],
    testUserIds[0],
  ]);
  testMessageIds.push(...resultsMessages.rows.map(({ id }) => id));
}

async function commonBeforeEach() {
  await db.query('BEGIN');
}

async function commonAfterEach() {
  await db.query('ROLLBACK');
}

async function commonAfterAll() {
  await db.end();
}

export {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  testAssignmentIds,
  testQuestionIds,
  testSubmissionIds,
  testNoteIds,
  testResourceIds,
  testSessionIds,
  testMessageIds,
  testAssignmentsStudentsIds,
};