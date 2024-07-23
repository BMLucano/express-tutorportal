import { sqlForPartialUpdate } from "./sql";
import { describe, test, it, expect } from "vitest";

describe("sqlForPartialUpdate", function () {
  test("works with 1 item", function () {
    const result = sqlForPartialUpdate(
      {f1: "v1"},
      {f1: "f1", f_2: "f2"}
    );
    expect(result).toEqual({
      setCols: "\"f1\"=$1",
      values: ["v1"]
    });
  });

  test("works with two items", function() {
    const result = sqlForPartialUpdate(
      {f1: "v1", f_2: "v2"},
      {f_2: "f2"}
    );
    expect(result).toEqual({
      setCols: "\"f1\"=$1, \"f2\"=$2",
      values: ["v1", "v2"],
    });
  });
})
