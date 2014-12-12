define (require, exports) ->
	# console.log 'me'

	Peer = require 'peerjs'
	Backbone = require 'backbone'
	Lobby = require 'modules/Lobby'
	Logger = require 'modules/Logger'
	Peer ?= window.Peer

	# console.log '\tLobby:', Lobby
	# console.log '\tLogger:', Logger
	# console.log '\tPeer:', Peer
	# console.log '\tthis:', this

	Me =
		peer: new Peer
			host: window.location.hostname
			path: 'tracker'
			port: 9000
			debug: 2
			logFunction: ->
				Logger.log Array::slice
					.call arguments
					.join ' '
		default_name: 'Me'
		name: 'Me'


	Me.peer.on 'open', (id) ->
		Lobby.addPerson
			name: Me.name
			id: id
			editable: true

	Me.peer.on 'connection', (connection) ->
		Network.handleConnection connection

	Me.peer.on 'close', ->
		Logger.log 'Disconnected from server'

	Me.peer.on 'error', ->
		Logger.warn 'Disconnected from server: %s', err

	exports = Me