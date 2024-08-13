import { describe, test, it, expect, beforeAll, beforeEach, afterAll, afterEach } from "vitest";
import request from "supertest";

import app from "../app";
import { createToken } from "../models/helpers/tokens";
import Resource from "../models/resource";

import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testResourceIds,
  testSessionIds
} from "../models/helpers/_testCommon";

beforeEach(async () => {
  await commonBeforeEach();
});

beforeAll(async () => {
  await commonBeforeAll();
});


afterEach(async () => {
  await commonAfterEach();
});

afterAll(async () => {
  await commonAfterAll();
});

const studentToken = createToken("u1", 'student');
const tutorToken = createToken("u2", 'tutor');


describe("Resources routes", function(){

  describe("GET /resources", function(){

    test("gets all resources for student", async function(){
      const resp = await  request(app)
        .get("/resources")
        .set("Authorization", `Bearer ${studentToken}`);

        expect(resp.body).toEqual([
          {
            id: testResourceIds[0],
            studentUsername: "u1",
            title: "Resource1",
            url: "url1",
            description: "Desc1",
          },
          {
            id: testResourceIds[1],
            studentUsername: "u2",
            title: "Resource2",
            url: "url2",
            description: "Desc2",
          },
        ]);
    });

    test("gets all resources for tutor", async function(){
      const resp = await  request(app)
        .get("/resources")
        .set("Authorization", `Bearer ${tutorToken}`);

        expect(resp.body).toEqual([
          {
            id: testResourceIds[0],
            studentUsername: "u1",
            title: "Resource1",
            url: "url1",
            description: "Desc1",
          },
          {
            id: testResourceIds[1],
            studentUsername: "u2",
            title: "Resource2",
            url: "url2",
            description: "Desc2",
          },
        ]);
    });

    test("unauth for anon", async function(){
      const resp = await request(app)
        .get("/resources");
      expect(resp.statusCode).toEqual(401);
    });
  });

  describe("GET /resources/:id", function(){

    test("works for student", async function(){
      const resource = await Resource.create({
        studentUsername: "u1",
        title: "Resource1",
        url: "www.example.com",
        description: "This is a resource",
      });
      const resp = await request(app)
        .get(`/resources/${resource.id}`)
        .set("Authorization", `Bearer ${studentToken}`);
      expect(resp.body).toEqual({...resource, id: resource.id});
    });

    test("works for tutor", async function(){
      const resource = await Resource.create({
        studentUsername: "u1",
        title: "Resource1",
        url: "www.example.com",
        description: "This is a resource",
      });
      const resp = await request(app)
        .get(`/resources/${resource.id}`)
        .set("Authorization", `Bearer ${tutorToken}`);
      expect(resp.body).toEqual({...resource, id: resource.id});
    });

    test("not found", async function(){
      const resp = await request(app)
        .get("/resources/845784")
        .set("Authorization", `Bearer ${studentToken}`);
      expect(resp.statusCode).toEqual(404);
    });
  });

  describe("POST /resources", function(){

    test("works for tutor", async function(){
      const resp = await request(app)
        .post("/resources")
        .set("Authorization", `Bearer ${tutorToken}`)
        .send({
          studentUsername: "u1",
          title: "Resource1",
          url: "www.example.com",
          description: "This is a resource",
        });
      expect(resp.body).toEqual({
        studentUsername: "u1",
        title: "Resource1",
        url: "www.example.com",
        description: "This is a resource",
        id: expect.any(Number),
      });
      expect(resp.statusCode).toEqual(201);
    });

    test("unauth for student", async function(){
      const resp = await request(app)
        .post("/resources")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          studentUsername: "u1",
          title: "Resource1",
          url: "www.example.com",
          description: "This is a resource",
        });
      expect(resp.statusCode).toEqual(401);
    });

    test("unauth for anon", async function(){
      const resp = await request(app)
        .post("/resources")
        .send({
          studentUsername: "u1",
          title: "Resource1",
          url: "www.example.com",
          description: "This is a resource",
        });
      expect(resp.statusCode).toEqual(401);
    });

    test("bad request: invalid data", async function(){
      const resp = await request(app)
        .post("/resources")
        .set("Authorization", `Bearer ${tutorToken}`)
        .send({
          studentUsername: "u1",
          title: "Resource1",
          url: "www.example.com",
          description: 123,
        });
      expect(resp.statusCode).toEqual(400);
    });

    test("bad request: missing data", async function(){
      const resp = await request(app)
        .post("/resources")
        .set("Authorization", `Bearer ${tutorToken}`)
        .send({
          studentUsername: "u1",
          title: "Resource1",
        });
      expect(resp.statusCode).toEqual(400);
    });
  });


})