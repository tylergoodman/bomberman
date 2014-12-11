define [
	'modules/Me'
	'modules/Chat'
	'modules/Logger'
], (Me, Chat, Logger) ->
	mode: 0
	max_peers: 4

	setOpen: ->
		@host.open = true
		@mode = 1;
	setClosed: ->
		@host.open = false
		@mode = 0
		if Object.keys(@host.peers).length
			@host.disconnect()
	isOpen: ->
		@host.open



	client:
		host_connection: null
		peers: {}
		handleData: (connection, data) ->
			switch data.evt
				# chat message
				when 'msg'
					Chat.makeMessage
						name: data.orig
						text: data.data
				# connection success
				when 'cnsc'
					Logger.log 'Connection success to %s!', connection.peer
					@host_connection = connection

					@addPerson id, name for id, name of data
					if Me.name isnt Me.default_name
						@host_connection.send
							evt: 'nc'
							data: Me.name
				# name change
				when 'nc'
					peer = @peers[data.orig]
					Logger.log 'Name update: %s -> %s', peer.get 'name', data.data
				# new person
				when 'np'
					Logger.log 'New peer: %s', data.data
					@addPerson data.data
				# person disconnected
				when 'dc'
					Logger.log '%s disconnected.'
					@peers[data.data].destroy();
					delete @peers[data.data]
				# game start
				when 'gs'
					'a'
				when 'move'
					'a'
				when 'bombDrop'
					'a'
				when 'personDied'
					'a'
				# game over
				when 'go'
					'a'
		addPerson: (id, name) ->
			if name?
				asd




	host:
		open: false
		peers: {}
		handleData: (connection, data) ->
			switch data.evt
				when 'msg'
					Chat.makeMessage
						name: @peers[connection.peer].lobby.get 'name'
						text: data.data
					@relay connection, data
				when 'nc'
					peer = @peers[connection.peer]
					Logger.log 'Name update: %s -> %s', peer.lobby.get 'name', data.data
					peer.lobby.set 'name', data.data
					@relay connection, data
				when 'move'
					#move
					@relay connection, data
				when 'bombDrop'
					#etc
					@relay connection, data
				when 'personDied'
					@relay connection, data
				# game over
				when 'go'
					@relay connection, data




	getPeers: ->
		if @isOpen
			return @host.peers
		return @client.peers

	send: (data) ->
		if @client.host_connection
			@cient.host_connection.send data
		else if Object.keys(@host.peers).length
			@host.sendToAll
				evt: data.evt
				orig: Me.peer.id
				data: data.data
		else
			console.log 'No one to send to... ', data