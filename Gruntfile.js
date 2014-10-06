module.exports = function(grunt) {

  grunt.initConfig({
    env: {
      dev: {
        NODE_ENV: 'test',
        BLUEBIRD_DEBUG: 1
      }
    },
    jshint: {
      options: {
          bitwise: true,
          eqeqeq: true,
          forin: true,
          freeze: true,
          immed: true,
          indent: 4,
          latedef: false,
          newcap: true,
          noarg: true,
          undef: true,
          unused: 'vars',
          maxparams: 4,
          maxdepth: 5,
          esnext: true,
          multistr: true,
          node: true
      },
      files: {
        src: ['Gruntfile.js', 'lib/**/*.js']
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          globals: ['typeOf','isEmpty','maxdeep','ix'],
          require: 'blanket'
        },
        src: ['test/**/*.js']
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'coverage.html'
        },
        src: ['test/app.js/**/*.js']
      },
      'travis-cov': {
        options: {
          reporter: 'travis-cov'
        },
        src: ['test/lib/**/*.js']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-env');


  // Default task.
  grunt.registerTask('test', ['env', 'mochaTest']);
  grunt.registerTask('default', ['env', 'jshint', 'mochaTest']);

};