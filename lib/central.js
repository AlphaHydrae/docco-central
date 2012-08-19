
var _ = require('underscore'),
    async = require('async'),
    Class = require('clah'),
    path = require('path');

var Generator = require('./generator'),
    Template = require('./template'),
    Utils = require('./utils');

module.exports = Class.extend({

  init: function(rootDir, srcFiles, options) {

    this.rootDir = rootDir;
    this.srcFiles = srcFiles;
    this.options = options;

    this.targetDir = path.join(this.rootDir, 'docs');
  },

  run : function() {

    this.start = new Date().getTime();
    console.log('Processing ' + this.srcFiles.length + ' files.');
    Utils.mkdirpSync(this.targetDir);

    var tasks = _.map(this.srcFiles, _.bind(this.generateDoc, this));
    tasks.unshift(_.bind(this.generateTemplate, this));

    var self = this;
    async.parallel(tasks, function(err) {
      if (err) {
        return console.log('ERROR: ' + err);
      }
      var duration = new Date().getTime() - self.start;
      console.log('Done in ' + duration + 'ms.');
    });
  },

  generateTemplate : function(callback) {
    new Template(this.rootDir, this.srcFiles).build();
    callback();
  },

  generateDoc : function(file) {
    
    var targetDir = path.join(this.rootDir, 'docs', path.dirname(file));
    Utils.mkdirpSync(targetDir);

    var gen = new Generator(this.rootDir, path.resolve(this.rootDir, file), targetDir);
    return _.bind(gen.run, gen);
  }
});

