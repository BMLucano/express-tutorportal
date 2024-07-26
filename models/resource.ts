import db from "../db";
import { BadRequestError, NotFoundError } from "../expressError";
import { sqlForPartialUpdate } from "./helpers/sql";
/**
 * Resource model for creating, updating, deleting, and retrieving resources.
 */

class Resource {

  /**
   * Creates a new resource and updates db.
   * @param {ResourceDataToCreate} data - The resource data.
   * @returns {ResourceData} - the created resource
   * @throws {BadRequestError} - if resource already in db.
   */
  static async create(data: ResourceDataToCreate): Promise<ResourceData>{
    const { studentUsername, title, url, description } = data;

    const dupeCheck = await db.query(`
      SELECT id FROM resources WHERE url = $1`,
      [url]
    );
    if(dupeCheck.rows[0])
      throw new BadRequestError(`Resource already exists with url: ${url}`);

    const result = await db.query(`
      INSERT INTO resources (student_username, title, url, description)
      VALUES ($1, $2, $3, $4)
      RETURNING id,
                student_username AS "studentUsername",
                title,
                url,
                description`,
      [studentUsername, title, url, description]
    );
    const resource = result.rows[0];

    return resource;
  }


  /**
   * Updates a resource in db with partial data or all data.
   *
   * @param {ResourceDataToUpdate} data - Partial or full resource data to update.
   * @param {number} id - Resource id to update
   * @returns {ResourceData} - Updated resource
   * @throws {NotFoundError} - if resource not found
   */
  static async update(id: number, data: ResourceDataToUpdate):
    Promise<ResourceData>{

      const { sqlSetCols, values } = sqlForPartialUpdate(
        data,
        {
          studentUsername: "student_username",
        }
      );
      const idSanitationIdx = "$" + (values.length + 1);

      const result = await db.query(`
        UPDATE resources
        SET ${sqlSetCols}
        WHERE id = ${idSanitationIdx}
        RETURNING id,
                  student_username AS "studentUsername",
                  title,
                  url,
                  description`,
                [...values, id]
      );
      const resource = result.rows[0];

      if(!resource)
        throw new NotFoundError(`No resource found with id: ${id}`);

      return resource;
    }


  /**
   * Deletes a resource from db by id.
   *
   * @param {number} id - Resource id to delete
   * @returns {undefined}
   * @throws {NotFoundError} - if resource not found
   */
  static async delete(id: number): Promise<void>{

    const result = await db.query(`
      DELETE FROM resources WHERE id = $1 RETURNING id`,
      [id]
    );
    const resource = result.rows[0];

    if (!resource)
      throw new NotFoundError(`No resource found with id: ${id}`);
  }

  /**
   * Get a single resource by id.
   *
   * @param {number} id - Resource id to retrieve
   * @returns {ResourceData} - Resource
   * @throws {NotFoundError} - if resource not found
   */
  static async get(id: number): Promise<ResourceData>{}

  /**
   * Gets all resources.
   *
   * @returns {ResourceData[]} - a list of all sessions
   */
    static async getAll(): Promise<ResourceData[]>{}


  /**
   * Gets resources based on student.
   *
   * @param {string} studentUsername
   * @returns {ResourceData[]} - a list of all resources for a student
   * @throws {NotFoundError} - if student not found
   */
  static async getResourcesByStudent(studentUsername: string): Promise<ResourceData[]>{}
}

type ResourceDataToUpdate = {
  studentUsername?: string | null,
  title?: string | null,
  url?: string | null,
  description?: string | null,
}

type ResourceDataToCreate = {
  studentUsername: string,
  title: string,
  url: string,
  description?: string,
}

type ResourceData = {
  id: number,
  studentUsername: string,
  title: string,
  url: string,
  description: string
}

export default Resource;