
	var Network = Bomberman.Network = {
		// for when you're connected to a host...
		// and you're the client..............
		host: {
			connected: false,
			connections: {
				game: null,
				system: null,
			},
		},
		// for when you're the host and others are the client
		client: {
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


	Network.send = function (data, type, connection, callback) {
		Logger.log('Sending some data to ' + connection.peer, data);
		var event_num = Math.floor(Math.random() * Math.pow(10, 7));
		connection.send({
			data: data,
			num: event_num,
			type: type,
		})
		if (callback)
			// try number event_num later to see if it works
			this.once(String(event_num), callback);
	}

	Network.handleData = function (connection, data) {
		Logger.log('Received some ' + connection.label + ' data from ' + connection.peer, data);

		if (this.dataHandlers[connection.label])
			this.dataHandlers[connection.label].handle(data);
		else
			throw new Error('No data handler for ' + connection.label + ' found');
	}

	Network.DataHandler = (function () {
		var DataHandler = function (label, events) {
			this.label = label
			for (var i in events)
				this.on(i, events[i]);
		}
		DataHandler.prototype.handle = function (data) {
			Logger.log('data handler ' + this.label + ' received data ', data);
			// left off here trying to get this to trigger
			this.trigger(data.label, data.data);
		}
		_.extend(DataHandler.prototype, Backbone.Events);
		return DataHandler;
		// handles incoming data
		// inherits backbone events
		// use as base for derived handlers 'chat(or system later on)' and 'game'
	})();
	Network.dataHandlers = {
		system: new Network.DataHandler('system', {
			'msg': function (message) {
				console.log('event delegated correctly!', message);
				Logger.log(message);
			}
		}),
		game: new Network.DataHandler('game', {

		}),
	},

	Network.handleConnection = function (connection) {
		Logger.log('Received connection request from ' + connection.peer);
		var self = this;

		connection.on('open', function () {
			Logger.log(this.label + ' connection from ' + this.peer + ' established');

			if (!self.client.open) {
				Logger.log('Closing ' + this.label + ' connection to ' + this.peer + ', lobby is closed');
				self.send('My lobby is closed', 'error', this, $.proxy(function () {
					Logger.log('Closing lobby');
					this.close();
				}, this));
			}
			else if (self.client.peers.length === self.client.max_peers) {
				Logger.log('Closing ' + this.label + ' connection to ' + this.peer + ', lobby is full');
				self.send('My lobby is full', 'error', this, $.proxy(function () {
					this.close();
				}, this));
			}
			else {
				Logger.log('Connection request successful');
				self.send('Request successful!', 'msg', this);
				self.addPeer(this);
			}
		});

		connection.on('data', function (data) {
			self.handleData(this, data);
		});

		connection.on('close', function () {
			Logger.log(this.label + ' connection to ' + this.peer + ' closed');
		});

		connection.on('error', function (err) {
			Logger.warn(this.label + ' connection errored', err);
		});

	}

	Network.createConnection = function (id, label) {
		Logger.log('Creating ' + label + ' connection to ' + id);
		var self = this;
		return new Promise(function (resolve, reject) {
			var connection = Me.peer.connect(id, {
				label: label,
			});
			connection.on('open', function () {
				Logger.log(this.label + ' connection to ' + this.peer + ' established');
				resolve(this);
			});
			if (!self.dataHandlers.hasOwnProperty(label))
				throw new Error('Could not create a connection: no data handlers for ' + label + ' found');
			connection.on('data', function (data) {
				self.handleData(this, data);
			});
			connection.on('close', function () {
				Logger.log(this.label + ' connection to ' + this.peer + ' closed');
				reject(this);
			});
			connection.on('error', function (err) {
				Logger.warn(this.label + ' connection errored', err);
				reject(this);
			});
		});
	}

	Network.connectTo = function (id) {
		Logger.log('Requesting connection to ' + id);
		var self = this;

		// chat connection
		Promise.all([this.createConnection(id, 'system'), this.createConnection(id, 'game')])
			.then(function (results) {
				// Logger.log(results);
				self.host.connected = true;
				results.forEach(function (connection) {
					self.host.connections[connection.label] = connection;
				});
			})
			.catch(function (error) {
				Logger.warn(error);
			});
	}

	Network.addPeer = function (connection) {
		if (!this.client.peers.hasOwnProperty(connection.peer))
			this.client.peers[connection.peer] = {};

		this.client.peers[connection.peer][connection.label] = connection;
		this.send(null, 'name_req', connection, function (name) {
			Lobby.addPlayer(new Person({
				name: name,
				id: connection.peer,
				editable: false,
			}));
		});
	}
	_.extend(Network, Backbone.Events);

