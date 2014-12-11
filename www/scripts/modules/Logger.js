(function() {
  define(['modules/Chat'], function(Chat) {
    return {
      _log: function(type, args) {
        return console[type].apply(console, args);
      },
      log: function() {
        this._log('log', arguments);
        return Chat.sendSysMessage(sprintf.apply(this, arguments));
      },
      warn: function() {
        this._log('warn', arguments);
        return Chat.sendSysWarning(sprintf.apply(this, arguments));
      }
    };
  });

}).call(this);
