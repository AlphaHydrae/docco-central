// ... is missing some documentation.

var Class = require('clah'),
    docco = require('docco'),
    path = require('path'),
    utils = require('./utils');

module.exports = Class.extend({

  init : function(workingDir, srcFile, targetDir, logger) {
    this.workingDir = workingDir;
    this.srcFile = srcFile;
    this.targetDir = targetDir;
    this.logger = logger;
  },

  run : function(callback) {

    // Each documentation file is moved to the same relative path as its
    // source file. That way it reflects the original project structure.
    var targetDir = path.join(this.targetDir, path.dirname(this.srcFile));
    utils.mkdirpSync(targetDir);

    docco.document([ this.srcFile ], { output: targetDir }, this.callback(this.done, this.srcFile, callback));
  },

  done : function(srcFile, callback) {
    this.logger.log('- ' + this.targetFile(srcFile));
    callback();
  },

  targetFile : function(srcFile) {

    var targetDir = path.join(this.targetDir, path.dirname(this.srcFile))
    return path.join(targetDir, path.basename(this.srcFile).replace(/\..*$/, '.html'));
  }
});

