"use strict";
var
  debug = require("debug")("karma-transform-preprocessor"),
  path = require("path");

function looksLikeAPromise(obj) {
  return obj.then && typeof (obj.then) === "function";
}

function createPreProcessor(config) {
  config = config || {};
  var transforms = config.transforms || [];
  return (content, file, done) => {
    var match = transforms.reduce((acc, cur) => {
      return acc || (file.path.match(cur.match) ? cur : undefined);
    }, null);
    if (!match) {
      return done(content);
    }
    var result = match.transform(content);
    return looksLikeAPromise(result) ? result.then(done) : done(result);
  };
}

createPreProcessor.$inject = ["config.transformConfig"];
module.exports = createPreProcessor;