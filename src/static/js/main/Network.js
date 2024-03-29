	var Network = Bomberman.Network = {
		// 0 = client
		// 1 = host
		mode: 0,
		max_peers: 4,

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
			host_connection: null,
			peers: {},
		},
		// for when you're the host and others are the client
		host: {
			open: false,
			peers: {}
		},

		getPeers: function () {
			if (this.isOpen)
				return this.host.peers;
			return this.client.peers;
		},
	}

	Network.send = function (data) {
		if (this.client.host_connection) {
			// console.log('sending to host');
			this.client.host_connection.send(data);
		}
		else if (Object.keys(this.host.peers).length) {
			// console.log('sending to all clients');
			this.host.handleData(null, data);
		}
		else {
			console.log('No one to send %s to...', data);
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
			// Player moved
			case 'playerMoved':
				game.state.states.Game.playerManager.MovePlayer(data.data.PlayerID, data.data.Dir);
				this.sendToAll(data);
			break;
			// Bomb dropped
			case 'bombDropped':
				var playerIndex = game.state.states.Game.playerManager.getIndexFromId(data.data.PlayerID)
				game.state.states.Game.explosionManager.DropBomb(playerIndex, data.data.Type);
				this.sendToAll(data);
			break;
			// Perk dropped
			case 'perkDropped':
				game.state.states.Game.perkManager.AddPerk(data.data.Col, data.data.Row, data.data.Type);
				this.sendToAll(data);
			break;
			case 'applyPerk':
				game.state.states.Game.perkManager.ApplyPerk(data.data.PlayerID, data.data.Col, data.data.Row)
				this.sendToAll(data);
			break;
			// player died
			case 'playerDied':
				game.state.states.Game.explosionManager.PlayerDied(data.data.playerId);
				this.sendToAll(data);
			break;
			// Game over - All Players died
			case 'gameOver':
				var peers = game.state.states.Game.peers
				var winnerIndex = peers.indexOf(data.data.Winner);
				if(data.data.Winner == null)
				{
					console.log("Error ending the game - invalid player count");
					game.state.start('GameOver', true, false, 1);
				}
				else
					game.state.start('GameOver', true, false, winnerIndex);
				this.sendToAll(data);
			break;
			// Sync all players
			case 'SyncPlayers':
				game.state.states.Game.playerManager.SyncPlayers(data.data.SyncData);
				this.sendToAll(data);
			break;

		}
	}
	Network.client.handleData = function (connection, data) {
		// Logger.log('Received some data from host %s!', connection.peer, data);
		// console.log(data);

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
				this.host_connection = connection;

				// add other players to lobby
				for (var p in data.data)
					this.addPerson(p, data.data[p]);

				// send name update on successful connection
				if (Me.name !== Me.default_name) {
					this.host_connection.send({
						evt: 'nc',
						data: Me.name,
					});
				}
			break;
			// name change
			case 'nc':
				var peer = this.peers[data.orig];
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
				this.peers[data.data].destroy();
				delete this.peers[data.data];
			break;
			// start game
			case 'gs':
				game.state.start('Instruction', true, false, Me.peer.id, data.data);
			break;
			// player moved
			case 'playerMoved':
				game.state.states.Game.playerManager.MovePlayer(data.data.PlayerID, data.data.Dir)
			break;
			// bomb dropped
			case 'bombDropped':
				var playerIndex = game.state.states.Game.playerManager.getIndexFromId(data.data.PlayerID)
				game.state.states.Game.explosionManager.DropBomb(playerIndex, data.data.Type);
			break;
			// Perk dropped
			case 'perkDropped':
				game.state.states.Game.perkManager.AddPerk(data.data.Col, data.data.Row, data.data.Type);
			break;
			case 'applyPerk':
				game.state.states.Game.perkManager.ApplyPerk(data.data.PlayerID, data.data.Col, data.data.Row)
			break;
			// player died
			case 'playerDied':
				game.state.states.Game.explosionManager.PlayerDied(data.data.playerId)
			break;
			// Game over - All Player died
			case 'gameOver':
				var peers = game.state.states.Game.peers
				var winnerIndex = peers.indexOf(data.data.Winner);
				game.state.start('GameOver', true, false, winnerIndex);
				if(data == null)
					console.log("Error ending the game - invalid player count");
			break;
			// Sync all players
			case 'SyncPlayers':
				game.state.states.Game.playerManager.SyncPlayers(data.data.SyncData);
			break;
		}
	}

	Network.client.addPerson = function (id, name) {
		if (name === undefined || name === Me.default_name)
			name = id;

		this.peers[id] = new Person({
			name: name,
			id: id,
		});
		Lobby.addPerson(this.peers[id]);
	}
	// needs updating
	Network.client.disconnect = function () {
		if (this.host_connection)
			this.host_connection.close();
		for (var id in this.peers)
			this.peers[id].destroy();
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
		// notify new peer that connection succeeded
		var data = {};
		for (var p in this.peers)
			data[p] = this.peers[p].lobby.get('name');
		data[Me.peer.id] = Me.name;

		connection.send({
			evt: 'cnsc',
			data: data,
		});
		// notify other players of the new peer
		for (var p in this.peers) {
			this.peers[p].connection.send({
				evt: 'np',
				data: connection.peer,
			});
		}

		// remember our new peer
		this.peers[connection.peer] = {
			connection: connection,
			lobby: new Person({
				name: connection.peer,
				id: connection.peer,
			}),
		};
		Lobby.addPerson(this.peers[connection.peer].lobby);
	}


	// Receive connection (you're a host now maybe)
	Network.handleConnection = function (connection) {
		Logger.log('Received connection request from %s.', connection.peer);
		var self = this;

		if (!self.host.open) {
			Logger.log('Refusing connection to %s: lobby is closed.', connection.peer);
			connection.on('open', function () {
				this.close();
			});
		}
		else if (Object.keys(self.host.peers).length === self.host.max_peers) {
			Logger.log('Refusing connection to %s: lobby is full.', connection.peer);
			connection.on('open', function () {
				connection.close();
			});
		}
		else {

			connection.on('open', function () {
				Logger.log('Connection with %s established.', this.peer);
				self.host.addPeer(this);
				$('#game-start').prop('disabled', false)
			});

			connection.on('data', function (data) {
				self.host.handleData(this, data);
			});

			connection.on('close', function () {
				Logger.log('%s disconnected.', this.peer);
				self.host.disconnectPeer(this.peer);
				if (!Object.keys(self.host.peers).length) 
				{
					$('#game-start').prop('disabled', true)
				}
			});

			connection.on('error', function (err) {
				Logger.warn('Connection to %s errored!', this.peer);
				self.host.disconnectPeer(this.peer);
				if (!Object.keys(self.host.peers).length) 
				{
					$('#game-start').prop('disabled', true)
				}
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

