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