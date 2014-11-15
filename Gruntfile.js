module.exports = function (grunt) {
    require('jit-grunt')(grunt, {
        includereplace: 'grunt-include-replace'
    });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // clean: {
        //     // lib: ['www/static/js/lib/libs.js', 'www/static/js/lib/libs.min.js'],
        //     // main: ['www/static/js/main.compiled.js', 'www/static/js/main.min.js']
        // },

        // concat: {
        //     options: {
        //         separator: '\n',
        //     },
        //     // lib: {
        //     //     src: ['www/static/js/libs/*.js', '!<%= concat.lib.dest %>'],
        //     //     dest: 'www/static/js/libs.min.js',
        //     // },
        // },

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
                    // cleancss: true,
                },
                files: {
                    'www/static/css/main.min.css': 'src/static/css/main.less',
                },
            },
        },

        includereplace: {
            main: {
                src: 'src/static/js/main.js',
                dest: 'www/static/js/main.built.js'
            },
            game: {
                src: 'src/static/js/game.js',
                dest: 'www/static/js/game.built.js'
            }
        },

        htmlmin: {
            main: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                },
                src: 'src/index.html',
                dest: 'www/index.html',
            }
        },

        watch: {
            less: {
                files: ['src/static/css/main.less'],
                tasks: ['less:dev'],
            },
            html: {
                files: ['src/index.html'],
                tasks: ['htmlmin'],
            },
            // lib: {
            //     files: ['www/static/js/lib/libs/*.js'],
            //     tasks: ['libs'],
            // },
            main: {
                files: ['src/static/js/main/*.js'],
                tasks: ['includereplace:main'],
            },
            game: {
                files: ['src/static/js/game/*.js'],
                tasks: ['includereplace:game']
            }
        }
    });

    // grunt.registerTask('lessc', ['less:dev']);
    // grunt.registerTask('main', ['includereplace:main', 'uglify:main']);
    grunt.registerTask('build', ['includereplace:main', 'less:dev']);

    // grunt.registerTask('libs', ['clean:lib', 'concat:lib', 'uglify:lib']);
    // grunt.registerTask('default', ['concat', 'uglify']);

};