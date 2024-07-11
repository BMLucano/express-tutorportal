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
  static async create(data: ResourceDataToCreate): Promise<ResourceData>{}


  /**
   * Updates a resource in db with partial data or all data.
   *
   * @param {ResourceDataToUpdate} data - Partial or full resource data to update.
   * @param {number} id - Resource id to update
   * @returns {ResourceData} - Updated resource
   * @throws {NotFoundError} - if resource not found
   */
  static async update(id: number, data: ResourceDataToUpdate): Promise<ResourceData>{}


  /**
   * Deletes a resource from db by id.
   *
   * @param {number} id - Resource id to delete
   * @returns {undefined}
   * @throws {NotFoundError} - if resource not found
   */
  static async delete(id: number): Promise<void>{}

  /**
   * Get a single resource by id.
   *
   * @param {number} id - Resource id to retrieve
   * @returns {ResourceData} - Resource
   * @throws {NotFoundError} - if resource not found
   */
  static async get(id: number): Promise<ResourceDataData>{}


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