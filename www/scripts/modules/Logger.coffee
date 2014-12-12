Logger = 
	_log: (type, args) ->
		console[type].apply console, args
	log: () ->
		@_log 'log', arguments
		Chat.sendMessage sprintf.apply this, arguments
	warn: () ->
		@_log 'warn', arguments
		Chat.sendMessage sprintf.apply this, arguments