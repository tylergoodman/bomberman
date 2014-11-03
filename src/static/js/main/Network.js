	var Network = Bomberman.Network = {
		// 0 = client
		// 1 = host
		mode: 0,
		setOpen: function () {
			this.host.open = true;
			this.mode = 1;
		},
		setClosed: function () {
			this.host.open = false;
			this.mode = 0;
		},
		// for when you're connected to a host...
		// and you're the client..............
		client: {
			host: {
				lobby: null,
				connection: null,
			},
			others: {},
		},
		// for when you're the host and others are the client
		host: {
			open: false,
			peers: {},
			max_peers: 4,
		},
	}

	Network.send = function (data) {
		if (this.client.host.connection) {
			// console.log('sending to host');
			this.client.host.connection.send(data);
		}
		else if (Object.keys(this.host.peers).length) {
			// console.log('sending to all clients');
			this.host.sendToAll({
				evt: data.evt,
				orig: Me.peer.id,
				data: data.data,
			});
		}
		else {
			Logger.log('No one to send %s to...', data);
		}
	}

	// datahandler for Host mode
	Network.host.handleData = function (connection, data) {
		// Logger.log('Received some data from client %s!', connection.peer, data);

		switch (data.evt) {
			// message
			case 'msg':
				// Logger.log(data.data);
				// console.log(data);
				Chat.makeMessage({
					name: this.peers[connection.peer].lobby.get('name'),
					text: data.data,
				});
				this.relay(connection, data);
			break;
			// name update
			case 'name':
				var peer = this.peers[connection.peer];
				Logger.log('Name update: %s -> %s.', peer.lobby.get('name'), data.data);
				peer.lobby.set('name', data.data);
			break;
		}
	}
	Network.host.relay = function (from, data) {
		var data = {
			evt: data.evt,
			orig: from.peer,
			data: data.data,
		}
		for (var p in this.peers)
			if (p !== from.peer)
				this.peers[p].connection.send(data);
	}
	Network.host.sendToAll = function (data) {
		for (var p in this.peers)
			this.peers[p].connection.send(data);
	}
	Network.client.handleData = function (connection, data) {
		// Logger.log('Received some data from host %s!', connection.peer, data);

		switch (data.evt) {
			case 'msg':
				// Logger.log(data.data);
				// console.log(data);
				Chat.makeMessage({
					name: data.orig,
					text: data.data,
				});
			break;
			// connect success
			// TODO - receive list of other players here
			// ... and other information
			case 'cnsc':
				Logger.log('Connection success to %s!', connection.peer);
				this.host.connection = connection;
				// send name update on successful connection
				if (Me.name !== Me.default_name) {
					connection.send({
						evt: 'name',
						data: Me.name,
					});
				}
				// add host to lobby
				this.host.lobby = new Person({
					name: connection.peer,
					id: connection.peer,
				});
				Lobby.addPerson(this.host.lobby);
			break;
		}
	}

	Network.handleConnection = function (connection) {
		Logger.log('Received connection request from %s.', connection.peer);
		var self = this;

		if (!self.host.open) {
			Logger.log('Closing connection to %s: lobby is closed.', connection.peer);
			connection.on('open', function () {
				connection.close();
			});
		}
		else if (Object.keys(self.host.peers).length === self.host.max_peers) {
			Logger.log('Closing connection to %s: lobby is full.', connection.peer);
			connection.on('open', function () {
				connection.close();
			});
		}
		else {

			connection.on('open', function () {
				Logger.log('Connection with %s established.', this.peer);
				this.send({
					evt: 'cnsc',
					// data: 'Request successful!',
				});
				self.addPeer(this);
			});

			connection.on('data', function (data) {
				self.host.handleData(this, data);
			});

			connection.on('close', function () {
				Logger.log('Connection to %s closed.', this.peer);
			});

			connection.on('error', function (err) {
				Logger.warn('Connection to %s errored!', this.peer);
			});

		}
	}

	Network.addPeer = function (connection) {
		this.host.peers[connection.peer] = {
			connection: connection,
			lobby: new Person({
				name: connection.peer,
				id: connection.peer,
			}),
		};
		Lobby.addPerson(this.host.peers[connection.peer].lobby);
	}

	/*
	Called by the lobby
	only available whilst own lobby is closed
	tries to connect to another person's (hopefully) open lobby
	*/
	Network.connectTo = function (id) {
		Logger.log('Requesting connection to %s.', id);
		var self = this;

		var connection = Me.peer.connect(id);
		connection.on('open', function () {
			Logger.log('Connection to %s established.', this.peer);
		});
		connection.on('data', function (data) {
			self.client.handleData(this, data);
		});
		connection.on('close', function () {
			Logger.log('Connection to %s closed.', this.peer);
			self.disconnect();
		});
		connection.on('error', function (err) {
			Logger.warn('Connection to %s errored!', this.peer, err);
			self.disconnect();
		});
	}

	Network.disconnect = function () {
		this.host.connected = false;
		this.host.connection = null;
	}

	_.extend(Network, Backbone.Events);

