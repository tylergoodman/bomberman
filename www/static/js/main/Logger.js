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