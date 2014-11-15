(function () {
	var Bomberman = {};

	var Chat = Bomberman.Chat = new (Backbone.View.extend({
		el: '#chat',
		template: _.template($('#template-Message').html()),

		max_messages: 100,
		num_messages: 0,

		initialize: function () {
			this.$input = this.$('.input input');
			this.$messages = this.$('#messages');

			this.$messages.perfectScrollbar({
				suppressScrollX: true,
			});

			this.sendSysMessage('Welcome to Bomberking!');
		},

		events: {
			'keyup .input input': function (e) {
				var text = this.$input.val();
				if (e.keyCode === 13 && text) {
					this.makeMessage({
						name: Me.name,
						text: text,
					});
					Network.send({
						evt: 'msg',
						data: text,
					});
					this.$input.val('');
				}
			}
		},

		makeMessage: function (data) {
			data.time = '[' + moment().format('h:mm:ss') + ']';
			var $message = this.template(data);

			this.addMessage($message);
		},

		sendSysMessage: function (string) {
			var $message = $('<div/>', {
				class: 'message system',
				text: string,
			});
			this.addMessage($message);
		},
		sendSysWarning: function (string) {
			var $message = $('<div/>', {
				class: 'message warning',
				text: string,
			});
			this.addMessage($message);
		},

		addMessage: function ($message) {
			this.$messages.append($message);
			this.num_messages++;

			if (this.num_messages > this.max_messages)
				this.$messages.children('.message')[0].remove();

			this.$messages.scrollTop(this.$messages[0].scrollHeight);
		},
	}));

	var Person = Bomberman.Person = Backbone.Model.extend({
		defaults: {
			name: null,
			id: null,
			editable: false,
		},
		sync: $.noop,
	});
	var PersonView = Bomberman.PersonView = Backbone.View.extend({
		template: _.template($('#template-Person').html()),

		initialize: function () {
			this.listenTo(this.model, 'change', this.update);
			this.listenTo(this.model, 'destroy', this.remove)

			this.render();

			// this might be fucked up
			this.header = this.$('.person-name');
			this.name = this.$('.name');
			this.id = this.$('.id');
		},

		events: {
			'keyup .name': function (e) {
				if (e.keyCode === 13) {
					var name = this.name.val();
					this.model.set('name', name);
					Logger.log('Changed name to %s.', name);
					Network.send({
						evt: 'nc',
						data: name,
					});
				}
			},
			'mouseover .id': function (e) {
				this.$('.id').select();
			},
			'destroy': function () {
				this.remove();
			},
		},

		render: function () {
			this.$el = $(this.template(this.model.attributes));
			this.el = this.$el.get(0);
			return this;
		},

		update: function () {
			this.header.text(this.model.get('name') || this.model.get('id'));
			this.name.val(this.model.get('name'));
			this.id.val(this.model.get('id'));
		},
	});

	var Lobby = Bomberman.Lobby = new (Backbone.View.extend({
		el: '#lobby',

		initialize: function () {
			this.$toggle = this.$('#lobby-toggle');
			this.$join = this.$('#lobby-join');
			this.$players = this.$('#players');

			this.$players.perfectScrollbar({
				suppressScrollX: true,
			});

			Chat.sendSysMessage('Your lobby is closed.');
		},

		events: {
			'click #lobby-toggle': function () {
				if (Network.isOpen()) {
					this.$toggle.find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
					this.$toggle.find('span').text('Open Lobby');
					this.$join.prop('disabled', false);

					Network.setClosed();

					Chat.sendSysMessage('Your lobby is now closed.');
				}
				else {
					this.$toggle.find('i').removeClass('fa-toggle-off').addClass('fa-toggle-on');
					this.$toggle.find('span').text('Close Lobby');
					this.$join.prop('disabled', true);

					Network.setOpen();

					Chat.sendSysMessage('Your lobby is now open.');
				}
			},
			'click #lobby-join': function () {
				var $modal = this.$('#modal-join');
				$modal.addClass('active');
				$('<div/>', {
					id: 'modal-overlay',
					css: {
						display: 'block',
						position: 'fixed',
						width: '100%',
						height: '100%',
						top: '0',
						background: 'black',
						opacity: '0.5',
					},
					click: function () {
						$modal.removeClass('active');
						$(this).remove();
					},
				}).appendTo('body');
				$modal.find('input').focus();
			},
			'click #modal-join button': function () {
				var id = this.$('#modal-join input').val();
				if (id) {
					$('#modal-overlay').trigger('click');
					Network.connectTo(id);
				}
			},
			'keyup #modal-join input': function (e) {
				if (e.keyCode === 13)
					this.$('#modal-join button').trigger('click');
			},
			'click #lobby-disconnect': function (e) {
				Network.client.disconnect();
			},
		},

		addPerson: function (player) {
			var myview = new PersonView({
				model: player,
			});
			this.$players.append(myview.el);
		},

		setConnected: function () {
			this.$('#lobby-disconnect').prop('hidden', false);
			this.$('#lobby-join').prop('hidden', true);
		},
		setDisconnected: function () {
			this.$('#lobby-disconnect').prop('hidden', true);
			this.$('#lobby-join').prop('hidden', false);
		},

	}));
	var Logger = Bomberman.Logger = {
		_log: function (type, args) {
			console[type].apply(console, args);
		},
		log: function () {
			this._log('log', arguments);
			Chat.sendSysMessage(sprintf.apply(this, arguments));
		},
		warn: function () {
			this._log('warn', arguments);
			Chat.sendSysWarning(sprintf.apply(this, arguments));
		},
	};

	var Me = Bomberman.Me = {
		peer: new Peer({
			host: window.location.hostname,
			path: '/tracker',
			port: 9000,
			debug: 2,
			logFunction: function () {
				Logger.log(Array.prototype.slice.call(arguments).join(' '));
			},
		}),
		default_name: 'ME',

	}
	Me.name = Me.default_name;

	_.extend(Me, Backbone.Events);

	Me.peer.on('open', function (id) {
		var me = new Person({
			name: Me.name,
			id: id,
			editable: true,
		});

		Me.listenTo(me, 'change:name', function () {
			this.name = me.get('name');
		});
		Lobby.addPerson(me);
	});
	Me.peer.on('connection', function (connection) {
		Network.handleConnection(connection);
	});
	Me.peer.on('close', function () {
		Logger.log('Disconnected from server.');
	});
	Me.peer.on('error', function (err) {
		Logger.warn('Disconnected from server: %s', err)
	});
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

	}

	Network.send = function (data) {
		if (this.client.host_connection) {
			// console.log('sending to host');
			this.client.host_connection.send(data);
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
		console.log(data);

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




	// $('window').on('unload', function () {
	// 	if (app.me.peer && !app.me.peer.destroyed)
	// 		app.me.peer.destroy();
	// });

	window.Bomberman = Bomberman;
})();