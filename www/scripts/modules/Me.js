(function() {
  define(function(require, exports) {
    var Backbone, Lobby, Logger, Me, Peer;
    Peer = require('peerjs');
    Backbone = require('backbone');
    Lobby = require('modules/Lobby');
    Logger = require('modules/Logger');
    if (Peer == null) {
      Peer = window.Peer;
    }
    Me = {
      peer: new Peer({
        host: window.location.hostname,
        path: 'tracker',
        port: 9000,
        debug: 2,
        logFunction: function() {
          return Logger.log(Array.prototype.slice).call(arguments).join(' ');
        }
      }),
      default_name: 'Me',
      name: 'Me'
    };
    Me.peer.on('open', function(id) {
      return Lobby.addPerson({
        name: Me.name,
        id: id,
        editable: true
      });
    });
    Me.peer.on('connection', function(connection) {
      return Network.handleConnection(connection);
    });
    Me.peer.on('close', function() {
      return Logger.log('Disconnected from server');
    });
    Me.peer.on('error', function() {
      return Logger.warn('Disconnected from server: %s', err);
    });
    return exports = Me;
  });

}).call(this);
