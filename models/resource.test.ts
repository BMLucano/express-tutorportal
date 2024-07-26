import { describe, test, it, expect } from "vitest";
import { NotFoundError, BadRequestError } from "../expressError";

import db from "../db";
import Resource from "./resource";

import { afterAll, beforeAll } from "vitest";
import { afterEach, beforeEach } from "vitest";
import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/***************** create */

describe("create", function () {
  const newData = {
    studentUsername: "u1",
    title: "Resource1",
    url: "www.example.com",
    description: "This is a resource",
  };

  test("works", async function () {
    let resource = await Resource.create(newData);
    expect(resource).toEqual({
      id: expect.any(Number),
      ...newData,
    });

    const result = await db.query(
      `SELECT student_username, title, url, description
       FROM resources
       WHERE student_username = 'u1' AND title = 'Resource1' AND url = 'www.example.com' AND description = 'This is a resource'`
    );
    expect(result.rows).toEqual([
      {
        student_username: "u1",
        title: "Resource1",
        url: "www.example.com",
        description: "This is a resource",
      },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
      await Resource.create(newData);
      await Resource.create(newData);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});


/************ update */

describe("update", function () {
  const updateData = {
    title: "New Title",
    url: "newurl1",
  };

  test("works", async function () {
    let resource = await Resource.update(1, updateData);
    expect(resource).toEqual({
      id: 1,
      studentUsername: "u1",
      ...updateData,
      description: "This is a resource",
    });

    const result = await db.query(
      `SELECT student_username, title, url, description
       FROM resources
       WHERE id = 1`
    );
    expect(result.rows).toEqual([
      {
        student_username: "u1",
        title: "New Title",
        url: "newurl1",
        description: "This is a resource",
      },
    ]);
  });

  test("not found", async function () {
    try {
      await Resource.update(999, updateData);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/****************** delete */

describe("delete", function () {
  test("works", async function () {
    const newResource = await db.query(`
      INSERT INTO resources (student_username, title, url, description)
      VALUES ('u1', 'New Title', 'newurl', 'This is a test')
      RETURNING id`)
    const resourceId = newResource.rows[0].id;

    await Resource.delete(resourceId);
    const result = await db.query(`SELECT * FROM resources WHERE id = $1`,
      [resourceId]);
    expect(result.rows).toEqual([]);
  });

  test("not found", async function () {
    try {
      await Resource.delete(999);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/*************** get */

describe("get", function () {
  test("works", async function () {
    let resource = await Resource.get(1);
    expect(resource).toEqual({
      id: 1,
      studentUsername: "u1",
      title: "Resource1",
      url: "url1",
      description: "This is a resource",
    });
  });

  test("not found", async function () {
    try {
      await Resource.get(999);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});


/*************** getAll */

describe("getAll", function () {
  test("works", async function () {
    let resources = await Resource.getAll();
    expect(resources).toEqual([
      {
        id: 1,
        studentUsername: "u1",
        title: "Resource1",
        url: "url1",
        description: "This is resource 1",
      },
      {
        id: 2,
        studentUsername: "u1",
        title: "Resource2",
        url: "url2",
        description: "This is resource 2",
      },
    ]);
  });

  test("empty array if no resources", async function () {
    // assume no resources in the database
    let resources = await Resource.getAll();
    expect(resources).toEqual([]);
  });
});

/**************** getResourcesByStudent */

describe("getResourcesByStudent", function () {
  test("works", async function () {
    let resources = await Resource.getResourcesByStudent("u1");
    expect(resources).toEqual([
      {
        id: 1,
        studentUsername: "u1",
        title: "Resource1",
        url: "url1",
        description: "This is a resource",
      },
    ]);
  });

  test("not found", async function () {
    try {
      await Resource.getResourcesByStudent("u3");
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});