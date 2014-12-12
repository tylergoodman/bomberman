(function () {

var Chat;

Chat = new (Backbone.View.extend({
  el: '#chat',
  template: _.template($('#template-Message').html()),
  max_messages: 100,
  num_messages: 0,
  initialize: function() {
    this.$messages = this.$('#messages');
    return this.$messages.perfectScrollbar({
      suppressScrollX: true
    });
  },
  events: {
    'keyup .input input': function(e) {
      var $input, text;
      $input = $('.input input');
      text = $input.val();
      if (e.keyCode === 13 && text) {
        this.makeMessage({
          name: Me.name,
          text: text
        });
        Network.send({
          evt: 'msg',
          data: text
        });
        return $input.val('');
      }
    }
  },
  makeMessage: function(data) {
    var $message;
    data.time = sprintf.sprintf('[%s]', moment().format('h:mm:ss'));
    $message = this.template(data);
    return this.addMessage($message);
  },
  sendMessage: function(string, warning) {
    var $message;
    if (warning == null) {
      warning = false;
    }
    $message = $('<div/>', {
      "class": 'message ' + (warning ? 'warning' : 'system'),
      text: string
    });
    return this.addMessage($message);
  },
  addMessage: function($message) {
    this.$messages.append($message);
    this.num_messages++;
    if (this.num_messages > this.max_messages) {
      this.$messages.children('.messages')[0].remove();
    }
    return this.$messages.scrollTop(this.$messages[0].scrollHeight);
  }
}));

var Lobby, Person, PersonView;

Person = Backbone.Model.extend({
  defaults: {
    name: null,
    id: null,
    editable: false
  },
  sync: $.noop
});

PersonView = Backbone.View.extend({
  template: _.template($('#template-Person').html()),
  initialize: function() {
    this.listenTo(this.model, 'change', this.update);
    this.listenTo(this.model, 'destroy', this.remove);
    return this.render();
  },
  events: {
    'keyup .name': function(e) {
      var name;
      name = this.$('.name').val();
      if (e.keyCode === 13 && name !== '') {
        this.model.set('name', name);
        Logger.log('Changed name to %s.', name);
        return Network.send({
          evt: 'nc',
          data: name
        });
      }
    },
    'mouseover .id': function(e) {
      return this.$('.id').select();
    },
    'destroy': function() {
      return this.remove();
    }
  },
  render: function() {
    this.$el = $(this.template(this.model.attributes));
    this.el = this.$el.get(0);
    return this;
  },
  update: function() {
    this.$('.person-name').text(this.model.get('name'));
    this.$('.name').val(this.model.get('name'));
    return this.$('.id').val(this.model.get('id'));
  }
});

Lobby = new (Backbone.View.extend({
  el: '#lobby',
  initialize: function() {
    this.$persons = this.$('#persons');
    this.$persons.perfectScrollbar({
      suppressScrollX: true
    });
    return this.persons = {};
  },
  events: {
    'click #lobby-toggle': function() {
      var toggle;
      toggle = this.$('#lobby-toggle');
      if (Network.isOpen()) {
        toggle.find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
        toggle.find('span').text('Open Lobby');
        this.$('#lobby-join').prop('disabled', false);
        Network.setClosed();
        return Chat.sendSysMessage('Your lobby is now closed.');
      } else {
        toggle.find('i').removeClass('fa-toggle-off').addClass('fa-toggle-on');
        toggle.find('span').text('Close Lobby');
        this.$('#lobby-join').prop('disabled', true);
        Network.setOpen();
        return Chat.sendSysMessage('Your lobby is now open');
      }
    },
    'click #lobby-join': function() {
      var $modal;
      $modal = $('#modal-join');
      $modal.addClass('active');
      $('<div/>', {
        id: 'modal-overlay',
        css: {
          display: 'block',
          position: 'fixed',
          width: '100%',
          height: '100%',
          top: 0,
          background: 'black',
          opacity: '0.5'
        },
        click: function() {
          $modal.removeClass('active');
          return $(this).remove();
        }
      }).appendTo('body');
      return $modal.find('input').focus();
    },
    'click #modal-join button': function() {
      var id;
      id = this.$('#modal-join input').val();
      if (id) {
        $('#modal-overlay').trigger('click');
        return Network.connectTo(id);
      }
    },
    'keyup #modal-join input': function(e) {
      if (e.keyCode === 13) {
        return this.$('#modal-join button').trigger('click');
      }
    },
    'click #lobby-disconnect': function() {
      return Network.client.disconnect();
    },
    'click #game-start': function(e) {
      var peers;
      this.$(e.currentTarget).prop('disabled', true);
      peers = Object.keys(Network.getPeers());
      peers.push(Me.peer.id);
      peers = peers.randomize();
      Me.index = peers.indexOf(Me.peer.id);
      console.log('game start');
      return Network.send({
        evt: 'gs',
        data: peers
      });
    }
  },
  addPerson: function(props) {
    var person, view;
    if (!props.name || props.name === Me.default_name) {
      props.name = props.id;
    }
    person = new Person(props);
    view = new PersonView({
      model: person
    });
    this.persons[props.id] = person;
    this.$persons.append(view.el);
    return this;
  },
  removePerson: function(id) {
    this.persons[id].destroy();
    delete this.persons[id];
    return this;
  },
  empty: function() {
    var id;
    for (id in this.persons) {
      this.removePerson(id);
    }
    return this;
  },
  setConnected: function() {
    this.$('#lobby-disconnect').prop('hidden', false);
    this.$('#lobby-join').prop('hidden', true);
    return this.$('#game-start').prop('disabled', true);
  },
  setDisconnected: function() {
    this.$('#lobby-disconnect').prop('hidden', true);
    this.$('#lobby-join').prop('hidden', false);
    return this.$('#game-start').prop('disabled', false);
  }
}));

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
            Lobby.addPerson({
              name: name,
              id: id
            });
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
          return Lobby.addPerson({
            name: data.data.name,
            id: data.data.id
          });
        case 'dc':
          Logger.log('%s disconnected.');
          return Lobby.removePerson(data.data);
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
            name: this.peers[connection.peer].lobby.get('name'),
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
        if (p !== from.peer) {
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
      Logger.log('Connection to host %s established', this.peer);
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



	// $('window').on('unload', function () {
	// 	if (app.me.peer && !app.me.peer.destroyed)
	// 		app.me.peer.destroy();
	// });

})();