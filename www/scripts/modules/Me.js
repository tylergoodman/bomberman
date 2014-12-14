var Me;

Me = {
  peer: new Peer({
    host: window.location.hostname,
    path: 'tracker',
    port: 9000,
    debug: 2,
    logFunction: function() {
      return console.log(Array.prototype.slice.call(arguments).join(' '));
    }
  }),
  default_name: 'Me',
  name: 'Me'
};

Me.peer.on('open', function(id) {
  Lobby.addPerson({
    name: Me.name,
    id: id,
    editable: true
  });
  return Bomberman.addPlayer(id, true);
});

Me.peer.on('connection', function(connection) {
  return Network.handleConnection(connection);
});

Me.peer.on('close', function() {
  return Logger.log('Disconnected from server');
});

Me.peer.on('error', function(err) {
  return Logger.warn('Disconnected from server: %s', err);
});
