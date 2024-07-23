
/**
 * A helper function for generating the SET clause of a SQL UPDATE statement.
 * .
 *
 * @param {Record<string, unknown>} dataToUpdate - An object with the fields to
 *        update as keys and their new values as values like:
 *        {field1: newVal, field2: newVal, ...}
 * @param {Record<string, string>} jsToSql - a mapping of js-style data fields
 *        to databse column names like {due_date: "dueDate", title: "title"}
 * @returns {{sqlSetCols: string, dataToUpdate: Record<string, unknown>}} - an
 *           an object containing the SET clause and the updated data.
 *
 */
function sqlForPartialUpdate(
  dataToUpdate: Record<string, unknown>, jsToSql: Record<string, string>):
  { sqlSetCols: string, dataToUpdate: Record<string, unknown> } {

}

export { sqlForPartialUpdate };