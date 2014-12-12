(function() {
  module.exports = function(grunt) {
    require('jit-grunt')(grunt, {
      includereplace: 'grunt-include-replace',
      bower: 'grunt-bower-task'
    });
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      less: {
        main: {
          options: {
            cleancss: false
          },
          files: {
            'www/stylesheets/main-min.css': 'www/stylesheets/main.less'
          }
        }
      },
      includereplace: {
        main: {
          src: 'www/scripts/main.js',
          dest: 'www/scripts/main-built.js'
        }
      },
      watch: {
        less: {
          files: ['www/stylesheets/main.less'],
          tasks: ['less:main']
        },
        scripts: {
          files: ['www/scripts/modules/*.js', 'www/scripts/main.js'],
          tasks: ['includereplace:main']
        }
      }
    });
    return grunt.registerTask('build', ['includereplace']);
  };

}).call(this);
