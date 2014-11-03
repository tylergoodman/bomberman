	var Network = Bomberman.Network = {
		// 0 = client
		// 1 = host
		mode: 0,
		setMode: function (mode) {
			if (mode === 'client')
				this.mode = 0;
			else if (mode === 'host')
				this.mode = 1;
			else
				throw new TypeError('Tried to set network to a mode that doesn\'t exist');
		},
		setOpen: function () {
			this.host.open = true;
		},
		setClosed: function () {
			this.host.open = false;
		},
		// for when you're connected to a host...
		// and you're the client..............
		client: {
			connected: false,
			connection: null,
		},
		// for when you're the host and others are the client
		host: {
			open: false,
			peers: {},
			max_peers: 4,
		},
	}

	Network.Peer = (function () {
		var peer = function (id) {
			this.id = id;
			this.connections = {};
		}
		return peer;
	})();


	Network.send = function (data, connection) {
		Logger.log('Sending some data to %s.', connection.peer, data);
		connection.send({
			data: data,
			evt: event,
		});
	}

	// datahandler for Host mode
	Network.host.handleData = function (connection, data) {
		// Logger.log('Received some data from client %s!', connection.peer, data);

		switch (data.evt) {
			// message
			case 'msg':
				Logger.log(data.data);
			break;
			// name update
			case 'name':
				var peer = this.host.peers[connection.peer];
				Logger.log('Name update: %s -> %s', peer.person.get('name'), data.data);
				peer.person.set('name', data.data);
			break;
		}
	}
	Network.host.relay = function (from, data) {
		for (var p in this.host.peer)
			if (p !== from)
				this.host.peer[p].connection.send(data);
	}
	Network.client.handleData = function (connection, data) {
		// Logger.log('Received some data from host %s!', connection.peer, data);

		switch (data.evt) {
			case 'msg':
				Logger.log(data.data);
			break;
			// connect success
			case 'cnsc':
				Logger.log('Connection success to %s', connection.peer);
				self.host.connected = true;
				self.host.connection = this;
				if (Me.name !== Me.default_name) {
					this.send({
						evt: 'name',
						data: Me.name,
					});
				}
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
			Logger.log('Closing connection to %s: lobby is full', connection.peer);
			connection.on('open', function () {
				connection.close();
			});
		}
		else {

			connection.on('open', function () {
				Logger.log('Connection from %s established.', this.peer);
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
			person: new Person({
				name: connection.peer,
				id: connection.peer,
			}),
		};
		Lobby.addPerson(this.host.peers[connection.peer].person);
		// connection.send({
		// 	evt: 'name_req',
		// });
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

