import { setUncaughtExceptionCaptureCallback } from "process";
import { BadRequestError } from "../../expressError";
/**
 * A helper function for generating the SET clause of a SQL UPDATE statement.
 * .
 *
 * @param {Record<string, unknown>} dataToUpdate - An object with the fields to
 *        update as keys and their new values as values like:
 *        {field1: newVal, field2: newVal, ...}
 * @param {Record<string, string>} jsToSql - a mapping of js-style data fields
 *        to databse column names like {due_date: "dueDate", title: "title"}
 * @returns {{sqlSetCols: string, values: string[]}} - an
 *           an object containing the SET clause and the updated data.
 *
 */
function sqlForPartialUpdate(
  dataToUpdate: Record<string, unknown>, jsToSql: Record<string, string>):
  { sqlSetCols: string, values: string[] } {

    const fields = Object.keys(dataToUpdate);
    if(fields.length === 0) throw new BadRequestError("No data");

  // {dueDate: '2024-07-23', title: "Title"} => ['"due_date"=$1', '"title"=$2']
    const columns = fields.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`,)

    return {
      sqlSetCols: columns.join(", "),
      values: Object.values(dataToUpdate).map(String),
      //^Object.values returns type of unknown[], so must convert to string
    };
}

export { sqlForPartialUpdate };