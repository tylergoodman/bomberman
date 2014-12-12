define (require) ->
	Chat = require 'modules/Chat'
	Lobby = require 'modules/Lobby'
	Me = require 'modules/Me'
	Network = require 'modules/Network'
	Logger = require 'modules/Logger'
		.init Chat.sendMessage, Chat
	# console.log 'asdf'
	# this
	# console.log Chat

	Chat.sendMessage 'Welcome to Bomberking!'