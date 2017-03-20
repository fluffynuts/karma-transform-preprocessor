/*global
  describe, expect, it, $
*/
"use strict";
describe("When running tests through karma", () => {
  function resolvePath(relPath) {
    return "/base/specs/integration/" + relPath;
  }
  it("should not transform unmatched files", done =>  {
    $.get(resolvePath("not-test-data/data.json"))
      .then(result => {
        expect(result.foo).toEqual("bar");
        done();
      });
  });
  it("should transform with the synchronous transformer", done => {
    $.get(resolvePath("test-data/synchronous-transform-data.json"))
      .then(result => {
        expect(result.foo).toEqual("synchronous");
        done();
      });
  });
  it("should transform with the asynchronous transformer", function (done) {
    $.get(resolvePath("test-data/asynchronous-transform-data.json"))
      .then(result => {
        expect(result.foo).toEqual("asynchronous");
        done();
      });
  });
});