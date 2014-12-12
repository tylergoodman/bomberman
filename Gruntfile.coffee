module.exports = (grunt) ->
	require('jit-grunt') grunt, 
		includereplace: 'grunt-include-replace'
		bower: 'grunt-bower-task'

	grunt.initConfig
		pkg: grunt.file.readJSON 'package.json'

		less:
			main:
				options:
					cleancss: false
				files:
					'www/stylesheets/main-min.css': 'www/stylesheets/main.less'

		includereplace:
			main:
				src: 'www/scripts/main.js'
				dest: 'www/scripts/main-built.js'

		watch:
			less:
				files: ['www/stylesheets/main.less']
				tasks: ['less:main']
			scripts:
				files: ['www/scripts/modules/*.js', 'www/scripts/main.js']
				tasks: ['includereplace:main']

	# 	bower:
	# 		install:
	# 			options:
	# 				targetDir: 'www/scripts/lib'
	# 				cleanTargetDir: true

	# 	concat:
	# 		options:
	# 			separator: '\n'
	# 		lib:
	# 			src: 'www/scripts/lib/**/*.js'
	# 			dest: 'www/scripts/libs-min.js'

	# 	uglify:
	# 		options:
	# 			preserveComments: 'some'
	# 		lib:
	# 			src: 'www/scripts/libs-min.js'
	# 			dest: 'www/scripts/libs-min.js'

	# 	clean:
	# 		lib:
	# 			src: 'www/scripts/libs-min.js'

	# grunt.registerTask 'build:libs', ['bower', 'clean:lib', 'concat:lib', 'uglify:lib']
	grunt.registerTask 'build', ['includereplace']