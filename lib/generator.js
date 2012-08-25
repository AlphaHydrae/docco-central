// ... is missing some documentation.

var Class = require('clah'),
    docco = require('docco'),
    path = require('path'),
    utils = require('./utils');

module.exports = Class.extend({

  init : function(workingDir, srcFile, targetDir) {
    this.workingDir = workingDir;
    this.srcFile = srcFile;
    this.targetDir = targetDir;
  },

  run : function(callback) {

    // Each documentation file is moved to the same relative path as its
    // source file. That way it reflects the original project structure.
    var targetDir = path.join(this.targetDir, path.dirname(this.srcFile));
    utils.mkdirpSync(targetDir);

    docco.document([ this.srcFile ], { output: targetDir }, callback);
  }
});

