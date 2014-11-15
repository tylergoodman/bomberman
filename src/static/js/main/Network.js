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
			if (Object.keys(this.host.peers).length)
				this.host.disconnect();
		},
		isOpen: function () {
			return this.host.open;
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

		// data = {
		// 	evt: event name,
		// 	data: actual data needed for the event
		// }
		// the origin is implied from the connection

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
			// name change
			case 'nc':
				var peer = this.peers[connection.peer];
				console.log(peer);
				Logger.log('Name update: %s -> %s.', peer.lobby.get('name'), data.data);
				peer.lobby.set('name', data.data);
				this.relay(connection, data);
			break;
		}
	}
	Network.client.handleData = function (connection, data) {
		// Logger.log('Received some data from host %s!', connection.peer, data);

		// data = {
		// 	evt: event name,
		// 	orig: origin (who sent this data),
		// 	data: actual data needed for event
		// }

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
			case 'cnsc':
				Logger.log('Connection success to %s!', connection.peer);
				this.host.connection = connection;
				// add host to lobby
				this.host.lobby = new Person({
					name: connection.peer,
					id: connection.peer,
				});
				Lobby.addPerson(this.host.lobby);

				// add other players to lobby
				for (var i = 0; i < data.data.length; i++) {
					this.addPerson(data.data[i]);
				}

				// send name update on successful connection
				if (Me.name !== Me.default_name) {
					connection.send({
						evt: 'name',
						data: Me.name,
					});
				}
			break;
			// name change
			case 'nc':
				var peer = this.others[data.orig];
				Logger.log('Name update: %s -> %s.', peer.get('name'), data.data);
				peer.set('name', data.data);
			break;
			// new player
			case 'np':
				Logger.log('New peer: %s', data.data);
				this.addPerson(data.data);
			break;
			// player disconnect
			case 'dc':
				Logger.log('%s disconnected.');
				this.others[data.data].destroy();
				delete this.others[data.data];
			break;
		}
	}
	Network.client.addPerson = function (id) {
		this.others[id] = new Person({
			name: id,
			id: id,
		});
		Lobby.addPerson(this.others[id]);
	}
	// needs updating
	Network.client.disconnect = function () {
		this.host.lobby.destroy();
		this.host.connection.close();
		for (var id in this.others)
			this.others[id].destroy();
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
	Network.host.removePeer = function (id) {
		this.peers[id].lobby.destroy();
		this.peers[id].connection.close();
		delete this.peers[id];
	}
	Network.host.disconnectPeer = function (id) {
		this.removePeer(id);
		this.sendToAll({
			evt: 'dc',
			data: id,
		});
	}
	Network.host.disconnect = function () {
		for (var p in this.peers)
			this.removePeer(p);
	}

	Network.host.addPeer = function (connection) {
		connection.send({
			evt: 'cnsc',
			data: Object.keys(this.peers),
			// data: 'Request successful!',
		});
		for (var p in this.peers) {
			this.peers[p].connection.send({
				evt: 'np',
				data: connection.peer,
			});
		}

		this.peers[connection.peer] = {
			connection: connection,
			lobby: new Person({
				name: connection.peer,
				id: connection.peer,
			}),
		};
		Lobby.addPerson(this.peers[connection.peer].lobby);
	}

	Network.handleConnection = function (connection) {
		Logger.log('Received connection request from %s.', connection.peer);
		var self = this;

		if (!self.host.open) {
			Logger.log('Closing connection to %s: lobby is closed.', connection.peer);
			connection.on('open', function () {
				this.close();
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
				self.host.addPeer(this);
			});

			connection.on('data', function (data) {
				self.host.handleData(this, data);
			});

			connection.on('close', function () {
				Logger.log('%s disconnected.', this.peer);
				self.host.disconnectPeer(this.peer);
			});

			connection.on('error', function (err) {
				Logger.warn('Connection to %s errored!', this.peer);
				self.host.disconnectPeer(this.peer);
			});

		}
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
			Logger.log('Connection to host %s established.', this.peer);
			Lobby.setConnected();
		});
		connection.on('data', function (data) {
			self.client.handleData(this, data);
		});
		connection.on('close', function () {
			Logger.log('Connection to host %s closed.', this.peer);
			self.client.disconnect();
			Lobby.setDisconnected();
		});
		connection.on('error', function (err) {
			Logger.warn('Connection to host %s errored!', this.peer, err);
			self.client.disconnect();
			Lobby.setDisconnected();
		});
	}

	// _.extend(Network, Backbone.Events);

