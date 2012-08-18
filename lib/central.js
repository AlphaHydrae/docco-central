
var _ = require('underscore'),
    async = require('async'),
    path = require('path');

var Generator = require('./generator'),
    Template = require('./template'),
    Utils = require('./utils');

function Central(rootDir, srcFiles, options) {

  this.rootDir = rootDir;
  this.srcFiles = srcFiles;
  this.options = options;

  this.targetDir = path.join(this.rootDir, 'docs');
}

_.extend(Central.prototype, {

  run : function() {
    Utils.mkdirpSync(this.targetDir);

    var tasks = _.map(this.srcFiles, _.bind(this.generateDoc, this));
    tasks.unshift(_.bind(this.generateTemplate, this));

    async.parallel(tasks, function(err) {
      if (err) {
        return console.log('ERROR: ' + err);
      }
    });
  },

  generateTemplate : function() {
    new Template(this.rootDir, this.srcFiles).build();
  },

  generateDoc : function(file) {
    
    var targetDir = path.join(this.rootDir, 'docs', path.dirname(file));
    Utils.mkdirpSync(targetDir);

    var gen = new Generator(this.rootDir, path.resolve(this.rootDir, file), targetDir);
    return _.bind(gen.run, gen);
  }
});

module.exports = Central;

