(function() {
  define(function(require) {
    var Chat, Lobby, Logger, Me, Network;
    Chat = require('modules/Chat');
    Lobby = require('modules/Lobby');
    Me = require('modules/Me');
    Network = require('modules/Network');
    Logger = require('modules/Logger').init(Chat.sendMessage, Chat);
    return Chat.sendMessage('Welcome to Bomberking!');
  });

}).call(this);
