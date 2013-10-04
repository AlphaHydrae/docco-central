
module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: [ 'lib/**/*.js' ]
    },

    jasmine_node: {
      requirejs: false,
      forceExit: true,
      growl: true
    },

    watch: {
      all: {
        files: [ 'lib/**/*.js', 'spec/**/*.js' ],
        tasks: [ 'jasmine_node' ],
        options: {
          atBegin: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jasmine-node');

  grunt.registerTask('default', [ 'jshint', 'jasmine_node' ]);
};
