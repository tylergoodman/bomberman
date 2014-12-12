var Logger;

Logger = {
  _log: function(type, args) {
    return console[type].apply(console, args);
  },
  log: function() {
    this._log('log', arguments);
    return Chat.sendMessage(sprintf.apply(this, arguments));
  },
  warn: function() {
    this._log('warn', arguments);
    return Chat.sendMessage(sprintf.apply(this, arguments));
  }
};
