define [
	'modules/Chat'
], (Chat) ->
	_log: (type, args) ->
		console[type].apply console, args
	log: ->
		@_log 'log', arguments
		Chat.sendSysMessage sprintf.apply this, arguments
	warn: ->
		@_log 'warn', arguments
		Chat.sendSysWarning sprintf.apply this, arguments
