/*global
  describe, it
*/
/*jshint expr: true */
"use strict";
var
  index = require("../../lib"),
  expect = require("chai").expect;

describe("karma-transform-preprocessor", () => {
  describe("index.js", () => {
    it("should export the transform", function () {
      var exported = index["preprocessor:transform"];
      expect(exported).to.be.defined;
      expect(exported).to.have.length(2);
      expect(exported[0]).to.equal("factory");
      expect(exported[1]).to.be.a.function;
    });
  });
  describe("factory", () => {
    function getFactory(config) {
      return index["preprocessor:transform"][1](config);
    }
    it("should return a function", () => {
      var sut = getFactory();
      expect(sut).to.be.a.function;
    });
    describe("result function", () => {
      function getFunction(config) {
        return getFactory(config);
      }
      it("should return the original contents when no config provided", done => {
        var
          sut = getFunction(undefined),
          data = "original",
          myDone = result => {
            expect(result).to.equal(data);
            done();
          };
        sut(data, { path: "somefile.txt" }, myDone);
      });
      it("should return the original contents when no transforms provided", done => {
        var
          sut = getFunction({ transforms: [] }),
          data = "original",
          myDone = result => {
            expect(result).to.equal(data);
            done();
          };
        sut(data, { path: "somefile.txt" }, myDone);
      });
      it("should transform when one matching synchronous transform", done => {
        var
          expected = "transformed",
          filepath = "somefile.txt",
          file = {
            path: filepath
          },
          content = "original",
          config = {
            transforms: [{
              match: /somefile.txt/,
              transform: d => expected
            }]
          },
          sut = getFunction(config),
          myDone = function (result) {
            expect(result).to.equal(expected);
            done();
          };
        expect(filepath.match(config.transforms[0].match)).to.exist;
        sut(content, file, myDone);
      });
      it("should transform when one matching asynchronous transform", done => {
        var
          expected = "transformed",
          filepath = "somefile.txt",
          file = {
            path: filepath
          },
          content = "original",
          config = {
            transforms: [{
              match: /somefile.txt/,
              transform: d => new Promise((resolve, reject) => resolve(expected))
            }]
          },
          sut = getFunction(config),
          myDone = function (result) {
            expect(result).to.equal(expected);
            done();
          };
        expect(filepath.match(config.transforms[0].match)).to.exist;
        sut(content, file, myDone);
      });
    });
  });
});