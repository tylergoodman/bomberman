define (require, exports) ->
	# console.log 'logger'

	sprintf = require 'sprintf'

	# exports = 
	# 	stdout: null
	# 	stderr: null
	# 	_log: (type, args) ->
	# 		console[type].apply console, args
	# 	log: () ->
	# 		@_log 'log', arguments
	# 		if @stdout?
	# 			@stdout sprintf.sprintf.apply @, arguments
	# 	warn: () ->
	# 		@_log 'warn', arguments
	# 		if @stderr?
	# 			@stderr sprintf.sprintf.apply @, arguments
	# 	init: (stdout, stderr, context) ->
	# 		@stdout = stdout.bind context
	# 		@stderr = stderr.bind context
	# 		this

	class Logger
		constructor: (stdio, context) ->
			@stdio = stdio?.bind context
		_log: (type, args) ->
			console[type].apply console, args
		log: () ->
			@_log 'log', arguments
			if @stdio?
				@stdio sprintf.sprintf.apply @, arguments
		warn: () ->
			@_log 'warn', arguments
			if @stdio?
				@stdio sprintf.sprintf.apply(@, arguments), true
		init: (stdio, context) ->
			if stdio
				if context
					@stdio = stdio.bind context
				else
					@stdio = @stdio
			this


	exports = new Logger

