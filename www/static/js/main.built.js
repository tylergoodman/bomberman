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
				if (e.keyCode === 13 && this.$input.val()) {
					this.makeMessage({
						name: Me.name,
						text: this.$input.val(),
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
	});
	var PersonView = Bomberman.PersonView = Backbone.View.extend({
		template: _.template($('#template-Person').html()),

		initialize: function () {
			this.listenTo(this.model, 'change', this.update);

			this.render();

			// this might be fucked up
			this.header = this.$('.person-name');
			this.name = this.$('.name');
			this.id = this.$('.id');
		},

		events: {
			'keyup .name': function (e) {
				if (e.keyCode === 13)
					this.model.set('name', this.name.val());
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
				if (Network.client.open) {
					this.$toggle.find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
					this.$toggle.find('span').text('Open Lobby');
					this.$join.prop('disabled', false);

					Network.setClosed();
					Network.setMode('client');

					Chat.sendSysMessage('Your lobby is now closed.');
				}
				else {
					this.$toggle.find('i').removeClass('fa-toggle-off').addClass('fa-toggle-on');
					this.$toggle.find('span').text('Close Lobby');
					this.$join.prop('disabled', true);

					Network.setOpen();
					Network.setMode('host');

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
		},

		addPerson: function (player) {
			var myview = new PersonView({
				model: player,
			});
			this.$players.append(myview.el);
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
		Logger.log('Own peer closed, refresh necessary');
	});
	Me.peer.on('error', function (err) {
		Logger.warn('Own peer errored', err)
	});
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




	// $('window').on('unload', function () {
	// 	if (app.me.peer && !app.me.peer.destroyed)
	// 		app.me.peer.destroy();
	// });

	window.Bomberman = Bomberman;
})();