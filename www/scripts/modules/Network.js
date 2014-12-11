(function() {
  define(['modules/Me', 'modules/Chat', 'modules/Logger'], function(Me, Chat, Logger) {
    return {
      mode: 0,
      max_peers: 4,
      setOpen: function() {
        this.host.open = true;
        return this.mode = 1;
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
          var id, name, peer;
          switch (data.evt) {
            case 'msg':
              return Chat.makeMessage({
                name: data.orig,
                text: data.data
              });
            case 'cnsc':
              Logger.log('Connection success to %s!', connection.peer);
              this.host_connection = connection;
              for (id in data) {
                name = data[id];
                this.addPerson(id, name);
              }
              if (Me.name !== Me.default_name) {
                return this.host_connection.send({
                  evt: 'nc',
                  data: Me.name
                });
              }
              break;
            case 'nc':
              peer = this.peers[data.orig];
              return Logger.log('Name update: %s -> %s', peer.get('name', data.data));
            case 'np':
              Logger.log('New peer: %s', data.data);
              return this.addPerson(data.data);
            case 'dc':
              Logger.log('%s disconnected.');
              this.peers[data.data].destroy();
              return delete this.peers[data.data];
            case 'gs':
              return 'a';
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
        addPerson: function(id, name) {
          if (name != null) {
            return asd;
          }
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
                name: this.peers[connection.peer].lobby.get('name'),
                text: data.data
              });
              return this.relay(connection, data);
            case 'nc':
              peer = this.peers[connection.peer];
              Logger.log('Name update: %s -> %s', peer.lobby.get('name', data.data));
              peer.lobby.set('name', data.data);
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
          return this.cient.host_connection.send(data);
        } else if (Object.keys(this.host.peers).length) {
          return this.host.sendToAll({
            evt: data.evt,
            orig: Me.peer.id,
            data: data.data
          });
        } else {
          return console.log('No one to send to... ', data);
        }
      }
    };
  });

}).call(this);
