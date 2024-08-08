import { describe, test, it, expect, beforeAll, beforeEach, afterAll, afterEach } from "vitest";
import request from "supertest";

import app from "../app";
import { createToken } from "../models/helpers/tokens";
import Note from "../models/note";

import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testNoteIds,
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

describe("Notes routes", function(){

  describe("GET /notes", function(){

    test("gets all notes for student", async function(){
      const resp = await request(app)
        .get("/notes")
        .set("Authorization", `Bearer ${studentToken}`);
      // expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual([
        {
          id: testNoteIds[0],
          studentUsername: "u1",
          title: "Note1",
          contentPath: "path1",
          sessionId: testSessionIds[0],
        },
        {
          id: testNoteIds[1],
          studentUsername: "u2",
          title: "Note2",
          contentPath: "path2",
          sessionId: testSessionIds[1],
        },
      ])
    });

    test("gets all notes for tutor", async function(){
      const resp = await request(app)
        .get("/notes")
        .set("Authorization", `Bearer ${tutorToken}`);
      // expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual([
        {
          id: testNoteIds[0],
          studentUsername: "u1",
          title: "Note1",
          contentPath: "path1",
          sessionId: testSessionIds[0],
        },
        {
          id: testNoteIds[1],
          studentUsername: "u2",
          title: "Note2",
          contentPath: "path2",
          sessionId: testSessionIds[1],
        },
      ])
    });

    test("unauth for anon", async function(){
      const resp = await request(app)
        .get("/notes");
      expect(resp.statusCode).toEqual(401)
    })
  })

  describe("GET /notes/:id", function(){

    test("works for student", async function(){
      const note = await Note.create({
        studentUsername: "u1",
        title: "New title",
        contentPath: "testnote.txt",
        sessionId: testSessionIds[0],
      });
      const resp = await request(app)
        .get(`/notes/${note.id}`)
        .set("Authorization", `Bearer ${studentToken}`);
      expect(resp.body).toEqual({...note, id: note.id});
    });

    test("works for tutor", async function(){
      const note = await Note.create({
        studentUsername: "u1",
        title: "New title",
        contentPath: "testnote.txt",
        sessionId: testSessionIds[0],
      });
      const resp = await request(app)
        .get(`/notes/${note.id}`)
        .set("Authorization", `Bearer ${tutorToken}`);
      expect(resp.body).toEqual({...note, id: note.id});
    });

    test("Not found", async function(){
      const resp = await request(app)
        .get("/notes/37534")
        .set("Authorization", `Bearer ${studentToken}`);
      expect(resp.statusCode).toEqual(404);
    });
  })

  describe.skip("POST /notes", function(){

    test("works", async function(){
      const resp = await request(app)
        .post("/notes")
        .set("Authorization", `Bearer ${tutorToken}`)
        .send({
          studentUsername: "u1",
          title: "New note",
          contentPath: "newnote.txt",
          sessionId: testSessionIds[0]
        });
      expect(resp.body).toEqual({
        studentUsername: "u1",
        title: "New note",
        contentPath: "newnote.txt",
        sessionId: testSessionIds[0],
        id: expect.any(Number),
      });
    });

    test("unauth for student", async function(){
      const resp = await request(app)
        .post("/notes")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          studentUsername: "u1",
          title: "New note",
          contentPath: "newnote.txt",
          sessionId: testSessionIds[0]
        });
      expect(resp.statusCode).toEqual(401);
    })

    test("unauth for anon", async function(){
      const resp = await request(app)
        .post("/notes")
        .send({
          studentUsername: "u1",
          title: "New note",
          contentPath: "newnote.txt",
          sessionId: testSessionIds[0]
        });
      expect(resp.statusCode).toEqual(401);
    });

    test("bad request: invalid data", async function(){
      const resp = await request(app)
        .post("/notes")
        .set("Authorization", `Bearer ${tutorToken}`)
        .send({
          studentUsername: "u1",
          title: "New note",
          contentPath: "newnote.txt",
          sessionId: "wrong data type"
        });
      expect(resp.statusCode).toEqual(400);
    })

    test("bad request: missing data", async function(){
      const resp = await request(app)
        .post("/notes")
        .set("Authorization", `Bearer ${tutorToken}`)
        .send({
          contentPath: "newnote.txt",
        });
      expect(resp.statusCode).toEqual(400);
    });
  })

  describe.skip("PATCH /notes/:id", function(){

    test("works: tutor", async function(){
      const resp = await request(app)
        .patch(`/notes/${testNoteIds[0]}`)
        .set("Authorization", `Bearer ${tutorToken}`)
        .send({
          title: "New Note1",
          content_path: "new path1"
        });
      expect(resp.body).toEqual({
        title: "New Note1",
        content_path: "new path1",
        studentUsername: "u1",
        id: testNoteIds[0],
        sessionId: testSessionIds[0],
      });
    });

    test("not found for no such note", async function(){
      const resp = await request(app)
        .patch(`/notes/blah`)
        .set("Authorization", `Bearer ${tutorToken}`)
        .send({
          title: "New Note 1",
          content_path: "new path 1"
        });
      expect(resp.statusCode).toEqual(400);
    });

    test("unauth for student", async function(){
      const resp = await request(app)
        .patch(`/notes/${testNoteIds[0]}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          title: "New Note1",
          content_path: "new path1"
        });
      expect(resp.statusCode).toEqual(401);

    })

    test("unauth for anon", async function(){
      const resp = await request(app)
        .patch(`/notes/${testNoteIds[0]}`)
        .send({
          title: "New Note1",
          content_path: "new path1"
        });
      expect(resp.statusCode).toEqual(401);
    })

    test("bad request: invalid data", async function(){
      const resp = await request(app)
        .patch(`/notes/${testNoteIds[0]}`)
        .set("Authorization", `Bearer ${tutorToken}`)
        .send({
          title: 1,
          content_path: "new path 1"
        });
      expect(resp.statusCode).toEqual(400);
    })

    test("bad request: id change attempt", async function(){
      const resp = await request(app)
        .patch(`/notes/${testNoteIds[0]}`)
        .set("Authorization", `Bearer ${tutorToken}`)
        .send({
          id: 5
        });
      expect(resp.statusCode).toEqual(400);
    });
  });

  describe.skip("DELETE /notes/:id", function(){

    test("works - tutor", async function(){
      const resp = await request(app)
        .delete(`/notes/${testNoteIds[0]}`)
        .set("Authorization", `Bearer ${tutorToken}`);
      expect(resp.body).toEqual({"deleted": testNoteIds[0]});
    });

    test("unauth for student", async function(){
      const resp = await request(app)
        .delete(`/notes/${testNoteIds[0]}`)
        .set("Authorization", `Bearer ${studentToken}`);
      expect(resp.statusCode).toEqual(401);
    });

    test("unauth for anon", async function(){
      const resp = await request(app)
        .delete(`/notes/${testNoteIds[0]}`)
      expect(resp.statusCode).toEqual(401);
    });

    test("not found for no such note", async function(){
      const resp = await request(app)
        .delete(`/notes/notanote`)
        .set("Authorization", `Bearer ${tutorToken}`);
      expect(resp.statusCode).toEqual(401);
    });
  });
})