var Network;

Network = {
  mode: 0,
  max_peers: 4,
  setOpen: function() {
    this.host.open = true;
    this.mode = 1;
    return this;
  },
  setClosed: function() {
    this.host.open = false;
    this.mode = 0;
    if (Object.keys(this.host.peers).length) {
      return this.host.disconnect();
    }
  },
  isOpen: function() {
    return this.host.open;
  },
  client: {
    host_connection: null,
    peers: {},
    handleData: function(connection, data) {
      var id, name, peer, _ref;
      switch (data.evt) {
        case 'msg':
          return Chat.makeMessage({
            name: data.orig,
            text: data.data
          });
        case 'cnsc':
          Logger.log('Connection success to %s!', connection.peer);
          this.host_connection = connection;
          _ref = data.data;
          for (id in _ref) {
            name = _ref[id];
            Lobby.addPerson({
              name: name,
              id: id
            });
            Bomberman.addPlayer(id);
          }
          if (Me.name !== Me.default_name) {
            return this.host_connection.send({
              evt: 'nc',
              data: Me.name
            });
          }
          break;
        case 'nc':
          peer = Lobby.persons[data.orig];
          Logger.log('Name update: %s -> %s', peer.get('name'), data.data);
          return peer.set('name', data.data);
        case 'np':
          Logger.log('New peer: %s', data.data);
          Lobby.addPerson({
            name: data.data.name,
            id: data.data.id
          });
          return Bomberman.addPlayer(data.data.id);
        case 'dc':
          Logger.log('%s disconnected.');
          return Lobby.removePerson(data.data);
        case 'gs':
          Bomberman.setPlayerPositions(data.data);
          return Bomberman.start();
        case 'move':
          return 'a';
        case 'bombDrop':
          return 'a';
        case 'personDied':
          return 'a';
        case 'go':
          return 'a';
      }
    },
    disconnect: function() {
      if (this.host_connection) {
        this.host_connection.close();
      }
      return Lobby.empty();
    }
  },
  host: {
    open: false,
    peers: {},
    handleData: function(connection, data) {
      var peer;
      switch (data.evt) {
        case 'msg':
          Chat.makeMessage({
            name: Lobby.persons[connection.peer].get('name'),
            text: data.data
          });
          return this.relay(connection, data);
        case 'nc':
          peer = Lobby.persons[connection.peer];
          Logger.log('Name update: %s -> %s', peer.get('name'), data.data);
          peer.set('name', data.data);
          return this.relay(connection, data);
        case 'move':
          return this.relay(connection, data);
        case 'bombDrop':
          return this.relay(connection, data);
        case 'personDied':
          return this.relay(connection, data);
        case 'go':
          return this.relay(connection, data);
      }
    },
    relay: function(from, data) {
      var connection, id, _ref;
      data.orig = from.peer;
      _ref = this.peers;
      for (id in _ref) {
        connection = _ref[id];
        if (from.peer !== id) {
          connection.send(data);
        }
      }
      return this;
    },
    sendToAll: function(data) {
      var connection, id, _ref;
      _ref = this.peers;
      for (id in _ref) {
        connection = _ref[id];
        connection.send(data);
      }
      return this;
    },
    removePerson: function(id) {
      this.peers[id].connection.close();
      delete this.peers[id];
      Lobby.removePerson(id);
      return this;
    },
    disconnectPerson: function(id) {
      this.removePerson(id);
      this.sendToAll({
        evt: 'dc',
        data: id
      });
      return this;
    },
    disconnect: function() {
      var id;
      for (id in this.peers) {
        this.removePerson(id);
      }
      return this;
    },
    addPerson: function(connection) {
      var data, id;
      data = {};
      for (id in this.peers) {
        data[id] = Lobby.persons[id].get('name');
      }
      data[Me.peer.id] = Me.name;
      connection.send({
        evt: 'cnsc',
        data: data
      });
      this.sendToAll({
        evt: 'np',
        data: connection.peer
      });
      this.peers[connection.peer] = connection;
      Lobby.addPerson({
        id: connection.peer
      });
      return this;
    }
  },
  getPeers: function() {
    if (this.isOpen) {
      return this.host.peers;
    }
    return this.client.peers;
  },
  send: function(data) {
    if (this.client.host_connection) {
      return this.client.host_connection.send(data);
    } else if (Object.keys(this.host.peers).length) {
      return this.host.sendToAll({
        evt: data.evt,
        orig: Me.peer.id,
        data: data.data
      });
    } else {
      return console.log('No one to send to... ', data);
    }
  },
  handleConnection: function(connection) {
    var self;
    Logger.log('Received connection request from %s.', connection.peer);
    if (!this.host.open) {
      Logger.log('Refusing connection to %s: lobby is closed.', connection.peer);
      connection.on('open', function() {
        return this.close();
      });
    } else if (Object.keys(this.host.peers).length === this.host.max_peers) {
      Logger.log('Refusing connection to %s: lobby is full.', connection.peer);
      connection.on('open', function() {
        return this.close();
      });
    } else {
      self = this;
      connection.on('open', function() {
        Logger.log('Connection with %s established.', this.peer);
        return self.host.addPerson(this);
      });
      connection.on('data', function(data) {
        return self.host.handleData(this, data);
      });
      connection.on('close', function() {
        Logger.log('%s disconnected.', this.peer);
        return self.host.disconnectPerson(this.peer);
      });
      connection.on('error', function(err) {
        Logger.warn('Connection to %s errored!', this.peer, err);
        return self.host.disconnectPerson(this.peer);
      });
    }
    return this;
  },
  connectTo: function(id) {
    var connection, self;
    Logger.log('Requesting connection to %s', id);
    connection = Me.peer.connect(id);
    self = this;
    connection.on('open', function() {
      Logger.log('Connection to host %s established.', this.peer);
      return Lobby.setConnected();
    });
    connection.on('data', function(data) {
      return self.client.handleData(this, data);
    });
    connection.on('close', function() {
      return Logger.log('Connection to host %s closed.', this.peer);
    });
    connection.on('error', function(err) {
      return Logger.warn('Connection to host %s errored!', this.peer, err);
    });
    return this;
  }
};
