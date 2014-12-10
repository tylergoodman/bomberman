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