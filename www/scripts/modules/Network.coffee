
Network =
	mode: 0
	max_peers: 4

	setOpen: () ->
		@host.open = true
		@mode = 1;
		this
	setClosed: () ->
		@host.open = false
		@mode = 0
		if Object.keys(@host.peers).length
			@host.disconnect()
	isOpen: () ->
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

					for id, name of data.data
						Lobby.addPerson
							name: name
							id: id
					if Me.name isnt Me.default_name
						@host_connection.send
							evt: 'nc'
							data: Me.name

				# name change
				when 'nc'
					peer = Lobby.persons[data.orig]
					Logger.log 'Name update: %s -> %s', peer.get('name'), data.data
					peer.set 'name', data.data

				# new person
				when 'np'
					Logger.log 'New peer: %s', data.data
					Lobby.addPerson
						name: data.data.name
						id: data.data.id

				# person disconnected
				when 'dc'
					Logger.log '%s disconnected.'
					Lobby.removePerson data.data

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
		disconnect: ->
			if @host_connection
				@host_connection.close()
			Lobby.empty()




	host:
		open: false
		peers: {}
		handleData: (connection, data) ->
			switch data.evt
				# chat message
				when 'msg'
					Chat.makeMessage
						name: Lobby.persons[connection.peer].get 'name'
						text: data.data
					@relay connection, data

				# name change
				when 'nc'
					peer = Lobby.persons[connection.peer]
					Logger.log 'Name update: %s -> %s', peer.get('name'), data.data
					peer.set 'name', data.data
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
		relay: (from, data) ->
			data.orig = from.peer
			for id, connection of @peers
				if from.peer isnt id
					connection.send data
			this
		sendToAll: (data) ->
			for id, connection of @peers
				connection.send data
			this
		removePerson: (id) ->
			@peers[id].connection.close();
			delete @peers[id]
			Lobby.removePerson id
			#game .kill id?
			this
		disconnectPerson: (id) ->
			@removePerson id
			@sendToAll
				evt: 'dc'
				data: id
			this
		disconnect: () ->
			for id of @peers
				@removePerson id
			this
		addPerson: (connection) ->
			data = {}
			for id of @peers
				data[id] = Lobby.persons[id].get 'name'
			data[Me.peer.id] = Me.name
			# send connection success with other persons in lobby
			connection.send
				evt: 'cnsc'
				data: data
			# notify other persons of new person
			@sendToAll
				evt: 'np'
				data: connection.peer
			# save person's connection under his id
			@peers[connection.peer] = connection
			# add person to lobby
			Lobby.addPerson
				id: connection.peer
			this







	getPeers: () ->
		if @isOpen
			return @host.peers
		return @client.peers

	send: (data) ->
		if @client.host_connection
			@client.host_connection.send data
		else if Object.keys(@host.peers).length
			@host.sendToAll
				evt: data.evt
				orig: Me.peer.id
				data: data.data
		else
			console.log 'No one to send to... ', data

	# Receive a connection request. You're (potentially) host.
	handleConnection: (connection) ->
		Logger.log 'Received connection request from %s.', connection.peer
		if !this.host.open
			Logger.log 'Refusing connection to %s: lobby is closed.', connection.peer
			connection.on 'open', () ->
				@close()
		else if Object.keys(@host.peers).length is @host.max_peers
			Logger.log 'Refusing connection to %s: lobby is full.', connection.peer
			connection.on 'open', () ->
				@close()
		else
			self = @
			connection.on 'open', () ->
				Logger.log 'Connection with %s established.', @peer
				self.host.addPerson @
			connection.on 'data', (data) ->
				self.host.handleData @, data
			connection.on 'close', () ->
				Logger.log '%s disconnected.', @peer
				self.host.disconnectPerson @peer
			connection.on 'error', (err) ->
				Logger.warn 'Connection to %s errored!', @peer, err
				self.host.disconnectPerson @peer
		this

	# Called by the button in the Lobby. You're connecting to a host to be a client.
	connectTo: (id) ->
		Logger.log 'Requesting connection to %s', id
		connection = Me.peer.connect id
		self = @
		connection.on 'open', () ->
			Logger.log 'Connection to host %s established.', @peer
			Lobby.setConnected()
		connection.on 'data', (data) ->
			self.client.handleData @, data
		connection.on 'close', () ->
			Logger.log 'Connection to host %s closed.', @peer
		connection.on 'error', (err) ->
			Logger.warn 'Connection to host %s errored!', @peer, err
		this
