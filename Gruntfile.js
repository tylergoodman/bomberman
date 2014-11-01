module.exports = function (grunt) {
    require('jit-grunt')(grunt, {
        includereplace: 'grunt-include-replace'
    });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            // lib: ['www/static/js/lib/libs.js', 'www/static/js/lib/libs.min.js'],
            // main: ['www/static/js/main.compiled.js', 'www/static/js/main.min.js']
        },

        concat: {
            options: {
                separator: '\n',
            },
            lib: {
                src: ['www/static/js/libs/*.js', '!<%= concat.lib.dest %>'],
                dest: 'www/static/js/libs.min.js',
            },
        },

        // uglify: {
        //     options: {
        //         preserveComments: 'some'
        //     },
        //     main: {
        //         src: ['<%= includereplace.main.dest %>'],
        //         dest: 'www/static/js/main.min.js'
        //     }
        // },

        less: {
            dev: {
                options: {
                    cleancss: true,
                },
                files: {
                    'www/static/css/main.min.css': 'www/static/css/main.less',
                },
            },
        },

        includereplace: {
            main: {
                src: 'www/static/js/main.js',
                dest: 'www/static/js/main.built.js'
            }
        },

        watch: {
            less: {
                files: ['www/static/css/main.less'],
                tasks: ['less:dev'],
            },
            // lib: {
            //     files: ['www/static/js/lib/libs/*.js'],
            //     tasks: ['libs'],
            // },
            main: {
                files: ['www/static/js/main/*.js'],
                tasks: ['includereplace:main'],
            },
        }
    });

    // grunt.registerTask('lessc', ['less:dev']);
    // grunt.registerTask('main', ['includereplace:main', 'uglify:main']);
    grunt.registerTask('build', ['includereplace:main', 'less:dev']);

    // grunt.registerTask('libs', ['clean:lib', 'concat:lib', 'uglify:lib']);
    // grunt.registerTask('default', ['concat', 'uglify']);

};