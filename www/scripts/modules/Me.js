(function() {
  define(['peerjs-git', 'backbone', 'modules/Lobby', 'modules/Logger'], function(Peer, Backbone, Lobby, Logger) {
    var Me;
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
      default_name: 'ME'
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
    return Me.peer.on('error', function() {
      return Logger.warn('Disconnected from server: %s', err);
    });
  });

}).call(this);
