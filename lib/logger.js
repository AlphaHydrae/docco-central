// ... is missing some documentation

var _ = require('underscore'),
    Class = require('clah');

module.exports = Class.extend({

  init : function(options) {
    this.options = _.isObject(options) ? options : {};
    this.noop = function() {};
  },

  log : function(message) {

    if (this.active()) {

      if (!this.stdoutWriteFunc) {
        console.log(message);
      } else {
        process.stdout.write = this.stdoutWriteFunc;
        console.log(message);
        process.stdout.write = this.noop;
      }
    }
  },

  active : function() {
    return !this.options.quiet;
  },

  toggleStdout : function() {

    if (this.stdoutWriteFunc) {
      process.stdout.write = this.stdoutWriteFunc;
      delete this.stdoutWriteFunc;
    } else {
      this.stdoutWriteFunc = process.stdout.write;
      process.stdout.write = this.noop;
    }
  }
});
