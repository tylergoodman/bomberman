
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
			'click #game-start': function (e) {
				this.$('#game-start').prop('disabled', true);
				var peers = Object.keys(Network.getPeers());
				peers.push(Me.peer.id);
				peers = peers.randomize();

				//Me.index = peers.indexOf(Me.peer.id);
				game.state.start('Instruction', true, false, Me.peer.id, peers);

				Network.host.sendToAll({
					evt: 'gs',
					data: peers,
				});
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
			this.$('#game-start').prop('disabled', true);
		},
		setDisconnected: function () {
			console.log('adf');
			this.$('#lobby-disconnect').prop('hidden', true);
			this.$('#lobby-join').prop('hidden', false);
			this.$('#game-start').prop('disabled', false);
		},


	}));