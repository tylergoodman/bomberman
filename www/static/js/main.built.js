(function () {
	var Bomberman = {};


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

			this.header = this.$('.person-name');
			this.name = this.$('.name');
			this.id = this.$('.id');
		},

		events: {
			'keyup .name': function (e) {
				// if (e.keyCode === 13)
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
			// this.name.val(this.model.get('name'));
			this.id.val(this.model.get('id'));
		},
	});

	var Lobby = Bomberman.Lobby = new (Backbone.View.extend({
		el: '#lobby',

		initialize: function () {
			this.toggle = this.$('#lobby-toggle');
			this.join = this.$('#lobby-join');
			this.players = this.$('#players');

		},

		events: {
			'click #lobby-toggle': function () {
				if (Network.client.open) {
					this.toggle.find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
					this.toggle.find('span').text('Open Lobby');
					this.join.prop('disabled', false);
					Network.client.open = false;
					Logger.log('Set lobby closed');
				}
				else {
					this.toggle.find('i').removeClass('fa-toggle-off').addClass('fa-toggle-on');
					this.toggle.find('span').text('Close Lobby');
					this.join.prop('disabled', true);
					Network.client.open = true;
					Logger.log('Set lobby open');
				}
			},
			'click #lobby-join': function () {
				var modal = this.$('#modal-join');
				modal.addClass('active');
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
						modal.removeClass('active');
						$(this).remove();
					},
				}).appendTo('body');
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

		addPlayer: function (player) {
			var myview = new PersonView({
				model: player,
			});
			this.players.append(myview.el);
		},
	}));
	var Logger = Bomberman.Logger = {
		$el: $('#game'),
		_log: function (type, args) {
			console[type].apply(console, args);
		},
		_format: function (args) {
			return Array.prototype.join.call(args, ', ');
		},
		log: function () {
			this._log('log', arguments);
			this.$el.append(this._format(arguments) + '<br>');
		},
		warn: function () {
			this._log('warn', arguments);
			this.$el.append(this._format(arguments) + '<br>');
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
		name: 'ME',

		amHost: function () {
			return Network.host === 'self';
		},
		amClient: function () {
			return Network.host !== 'self';
		},
	}
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
		Lobby.addPlayer(me);
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




	$('window').on('unload', function () {
		// if (app.me.peer && !app.me.peer.destroyed)
		// 	app.me.peer.destroy();
	});

	window.Bomberman = Bomberman;
})();