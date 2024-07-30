import { describe, test, it, expect } from "vitest";

import jwt from "jsonwebtoken";
import { createToken } from "./tokens";
import { SECRET_KEY } from "../../config";

describe("createToken", function() {
  test("works: student", function () {
    const token = createToken( "u1", "student");
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "u1",
      role: "student",
    });
  });

  test("works: tutor", function() {
    const token = createToken("u2", "tutor");
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "u2",
      role: "tutor",
    });
  });
})