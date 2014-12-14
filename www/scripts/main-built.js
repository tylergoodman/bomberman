(function () {

var Chat;

Chat = new (Backbone.View.extend({
  el: '#chat',
  template: _.template($('#template-Message').html()),
  max_messages: 100,
  num_messages: 0,
  initialize: function() {
    this.$messages = this.$('#messages');
    this.$messages.perfectScrollbar({
      suppressScrollX: true
    });
    return this.sendMessage('Welcome to Bomberking!');
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
    data.time = sprintf('[%s]', moment().format('h:mm:ss'));
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
    if (this.model.get('editable') === false) {
      this.$el.children(':last').prop('hidden', true);
    }
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
        return Chat.sendMessage('Your lobby is now closed.');
      } else {
        toggle.find('i').removeClass('fa-toggle-off').addClass('fa-toggle-on');
        toggle.find('span').text('Close Lobby');
        this.$('#lobby-join').prop('disabled', true);
        Network.setOpen();
        return Chat.sendMessage('Your lobby is now open');
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
      var positions;
      this.$(e.currentTarget).prop('disabled', true);
      positions = Bomberman.setPlayerPositions();
      console.log(positions);
      Network.send({
        evt: 'gs',
        data: positions
      });
      return Bomberman.start();
    }
  },
  addPerson: function(props) {
    var person, view;
    if (!props.name || props.name === Me.default_name && !props.editable) {
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

var Bomberman,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Bomberman = (function() {
  var Bomb, Game, Player;
  Game = (function() {
    function Game() {
      var $el, game, me, self, titlescreen;
      $el = $('#game');
      self = this;
      this.me = me = null;
      this.players = {};
      this.collidables = [];
      this.dead;
      this.map;
      titlescreen = {
        preload: function() {
          this.game.load.image('background', 'images/titlescreenfinal.png');
          this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
          return this.game.scale.setScreenSize();
        },
        create: function() {
          titlescreen = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
          titlescreen.tileScale.x = 1050 / 1375;
          return titlescreen.tileScale.y = 630 / 825;
        }
      };
      game = {
        preload: function() {
          this.game.load.image('background', 'images/background.png');
          this.game.load.spritesheet('girl', 'images/girl.png', 40, 68);
          this.game.load.tilemap('level', 'images/map.json', null, Phaser.Tilemap.TILED_JSON);
          this.game.load.image('tiles', 'images/tiles.png');
          this.game.load.spritesheet('bomb', 'images/objects/bomb.png', 70, 70);
          this.game.load.spritesheet('explosion', 'images/objects/explosion.png', 70, 70);
          this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
          this.game.scale.setScreenSize();
          return this.game.stage.disableVisibilityChange = true;
        },
        create: function() {
          var breakable, it, player, unbreakable, _ref;
          this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
          this.game.physics.startSystem(Phaser.Physics.ARCADE);
          self.map = this.game.add.tilemap('level');
          self.map.addTilesetImage('tiles');
          self.map.setCollision(1, true, 'breakable');
          breakable = self.map.createLayer('breakable');
          self.collidables.push(breakable);
          self.map.setCollision(2, true, 'unbreakable');
          unbreakable = self.map.createLayer('unbreakable');
          self.collidables.push(unbreakable);
          self.dead = this.game.add.group();
          _ref = self.players;
          for (it in _ref) {
            player = _ref[it];
            player.create();
          }
          return this;
        },
        update: function() {
          var id, player, _ref;
          _ref = self.players;
          for (id in _ref) {
            player = _ref[id];
            player.update(this.game);
          }
          this;
          return self.dead.removeAll(true);
        }
      };
      this.phaser = new Phaser.Game(1050, 630, Phaser.AUTO, $el[0]);
      this.phaser.state.add('title', titlescreen, true);
      this.phaser.state.add('game', game);
    }

    Game.prototype.setPlayerPositions = function(positions) {
      var i, player, players, _i, _len;
      if (typeof positions === 'undefined') {
        players = Object.values(this.players);
        players = players.randomize();
      } else {
        players = players.map(function(id) {
          return this.players[id];
        });
      }
      for (i = _i = 0, _len = players.length; _i < _len; i = ++_i) {
        player = players[i];
        switch (i) {
          case 0:
            player.origin = this.getOrigin(0, 0);
            break;
          case 1:
            player.origin = this.getOrigin(0, 14);
            break;
          case 2:
            player.origin = this.getOrigin(8, 0);
            break;
          case 3:
            player.origin = this.getOrigin(8, 14);
        }
      }
      return players.map(function(player) {
        return player.id;
      });
    };

    Game.prototype.start = function() {
      this.phaser.state.start('game', true);
      return this;
    };

    Game.prototype.addPlayer = function(id, me) {
      if (me == null) {
        me = false;
      }
      return this.players[id] = new Player(this, id, me);
    };

    Game.prototype.getGridSpace = function(sprite) {
      return {
        x: ((sprite.body.position.x + sprite.body.halfWidth) / 1050 * 15).floor(),
        y: ((sprite.body.position.y + sprite.body.halfHeight) / 630 * 9).floor()
      };
    };

    Game.prototype.getOrigin = function(gridspace) {
      if (typeof gridspace === 'object') {
        return {
          x: gridspace.x * 70,
          y: gridspace.y * 70
        };
      } else {
        return {
          x: arguments[0] * 70,
          y: arguments[1] * 70
        };
      }
    };

    Game.prototype.inBounds = function(x, y) {
      if ((__indexOf.call([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], x) >= 0) && (__indexOf.call([0, 1, 2, 3, 4, 5, 6, 7, 8], y) >= 0)) {
        return true;
      } else {
        return false;
      }
    };

    return Game;

  })();
  Player = (function() {
    function Player(game, id, me) {
      this.game = game;
      this.id = id;
      this.me = me;
      this.input = null;
      this.facing = null;
      this.velocity = {
        x: 0,
        y: 0
      };
      this.movespeed = 300;
      this.sprite = null;
      this.bombs = [];
      this.explosion_power = {
        x: 1,
        y: 1
      };
      this.explosions_stop_on_wall = true;
      this.origin = {
        x: 0,
        y: 0
      };
      this.isDead = false;
    }

    Player.prototype.create = function() {
      console.log('make player', this);
      this.sprite = this.game.phaser.add.sprite(this.origin.x, this.origin.y, 'girl', 8);
      this.game.phaser.physics.enable(this.sprite, Phaser.Physics.ARCADE);
      this.sprite.body.setSize(40, 40, 0, this.sprite.texture.height - 40);
      this.sprite.body.collideWorldBounds = true;
      this.sprite.animations.add('up', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
      this.sprite.animations.add('down', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
      this.sprite.animations.add('left', [16, 17, 18, 19, 20, 21, 22, 23], 10, true);
      this.sprite.animations.add('right', [24, 25, 26, 27, 28, 29, 30, 31], 10, true);
      this.sprite.events.onKilled.add(function() {
        this.game.dead.add(this.sprite);
        return delete this.game;
      }, this);
      if (this.me) {
        this.input = this.game.phaser.input.keyboard.createCursorKeys();
        return this.input.space = this.game.phaser.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      }
    };

    Player.prototype.update = function(game) {
      var collidable, _i, _len, _ref;
      _ref = this.game.collidables;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        collidable = _ref[_i];
        game.physics.arcade.collide(this.sprite, collidable);
      }
      if (this.me) {
        if (this.input.space.isDown) {
          this.dropBombThrottled();
        }
        if (this.input.left.isDown || this.input.right.isDown || this.input.down.isDown || this.input.up.isDown) {
          Network.send({
            evt: 'moving',
            data: {
              velocity: this.sprite.body.velocity
            }
          });
          if (this.input.left.isDown) {
            this.sprite.body.velocity.x = -1 * this.movespeed;
            this.sprite.body.velocity.y = 0;
            if (this.facing !== 'left') {
              this.sprite.animations.play('left');
              return this.facing = 'left';
            }
          } else if (this.input.right.isDown) {
            this.sprite.body.velocity.x = this.movespeed;
            this.sprite.body.velocity.y = 0;
            if (this.facing !== 'right') {
              this.sprite.animations.play('right');
              return this.facing = 'right';
            }
          } else if (this.input.down.isDown) {
            this.sprite.body.velocity.y = this.movespeed;
            this.sprite.body.velocity.x = 0;
            if (this.facing !== 'down') {
              this.sprite.animations.play('down');
              return this.facing = 'down';
            }
          } else if (this.input.up.isDown) {
            this.sprite.body.velocity.y = -1 * this.movespeed;
            this.sprite.body.velocity.x = 0;
            if (this.facing !== 'up') {
              this.sprite.animations.play('up');
              return this.facing = 'up';
            }
          }
        } else {
          if (this.facing !== 'idle') {
            this.sprite.animations.stop();
            if (this.facing === 'up') {
              this.sprite.frame = 0;
            } else if (this.facing === 'down') {
              this.sprite.frame = 8;
            } else if (this.facing === 'left') {
              this.sprite.frame = 16;
            } else if (this.facing === 'right') {
              this.sprite.frame = 24;
            }
            this.facing = 'idle';
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
            return Network.send({
              evt: 'moveEnd',
              data: {
                position: this.sprite.position
              }
            });
          }
        }
      } else {
        this.sprite.body.velocity.x = this.velocity.x;
        this.sprite.body.velocity.y = this.velocity.y;
        if (this.velocity.x > 0) {
          this.facing = 'right';
          return this.sprite.animations.play('right');
        } else if (this.velocity.x < 0) {
          this.facing = 'left';
          return this.sprite.animations.play('left');
        } else if (this.velocity.y > 0) {
          this.facing = 'up';
          return this.sprite.animations.play('up');
        } else if (this.velocity.y < 0) {
          this.facing = 'down';
          return this.sprite.animations.play('down');
        } else {
          this.sprite.animations.stop();
          if (this.facing === 'up') {
            this.sprite.frame = 0;
          } else if (this.facing === 'down') {
            this.sprite.frame = 8;
          } else if (this.facing === 'left') {
            this.sprite.frame = 16;
          } else if (this.facing === 'right') {
            this.sprite.frame = 24;
          }
          return this.facing = 'idle';
        }
      }
    };

    Player.prototype.dropBombThrottled = (function() {
      return this.dropBomb();
    }).throttle(500);

    Player.prototype.dropBomb = function() {
      var bomb;
      return bomb = new Bomb(this);
    };

    Player.prototype.die = function(force) {
      if (force == null) {
        force = false;
      }
      console.log('tried to die');
      if (Network.client.host_connection || force) {
        return this.sprite.kill();
      }
    };

    Player.prototype.isMoving = function() {
      return !!(this.sprite.body.velocity.x || this.sprite.body.velocity.y);
    };

    return Player;

  })();
  Bomb = (function() {
    function Bomb(owner) {
      var origin, _i, _ref, _results;
      this.owner = owner;
      this.explode_speed = 10;
      this.frame_count = 6;
      this.explosion_frames = 5;
      this.gridspace = this.owner.game.getGridSpace(this.owner.sprite);
      origin = this.owner.game.getOrigin(this.gridspace);
      this.sprite = this.owner.game.phaser.add.sprite(origin.x, origin.y, 'bomb', 0);
      this.owner.game.phaser.physics.enable(this.sprite, Phaser.Physics.ARCADE);
      this.sprite.body.immovable = true;
      this.sprite.animations.add('explode', (function() {
        _results = [];
        for (var _i = 0, _ref = this.frame_count; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this), this.explode_speed);
      this.sprite.frame = 0;
      this.sprite.events.onKilled.add(function() {
        this.owner.game.dead.add(this.sprite);
        this.owner.game.collidables.remove(this.sprite);
        delete this.owner;
        return delete this.sprite;
      }, this);
      this.owner.game.collidables.push(this.sprite);
      this.owner.game.phaser.physics.enable(this.sprite, Phaser.Physics.ARCADE);
      this.owner.game.phaser.time.events.add(Phaser.Timer.SECOND * 2, this.explode, this);
    }

    Bomb.prototype.explode = function() {
      this.sprite.animations.play('explode', null, false, true);
      this.explode_at(this.gridspace);
      this.explode_in_direction(this.gridspace, 'x', {
        x: 1,
        y: 0
      });
      this.explode_in_direction(this.gridspace, 'x', {
        x: -1,
        y: 0
      });
      this.explode_in_direction(this.gridspace, 'y', {
        x: 0,
        y: 1
      });
      return this.explode_in_direction(this.gridspace, 'y', {
        x: 0,
        y: -1
      });
    };

    Bomb.prototype.explode_in_direction = function(gridspace, xy, direction, distance_from_explosion) {
      if (distance_from_explosion == null) {
        distance_from_explosion = 1;
      }
      if (distance_from_explosion > this.owner.explosion_power[xy]) {
        return;
      }
      gridspace = {
        x: gridspace.x + direction.x,
        y: gridspace.y + direction.y
      };
      if (!this.owner.game.inBounds(gridspace.x, gridspace.y)) {
        return;
      }
      this.explode_at(gridspace);
      if (this.owner.game.map.getTile(gridspace.x, gridspace.y, 'unbreakable')) {
        return;
      }
      if (this.owner.game.map.getTile(gridspace.x, gridspace.y, 'breakable') && this.owner.explosions_stop_on_wall) {
        this.owner.game.map.removeTile(gridspace.x, gridspace.y, 'breakable');
        return;
      }
      this.owner.game.map.removeTile(gridspace.x, gridspace.y, 'breakable');
      return this.explode_in_direction(gridspace, xy, direction, ++distance_from_explosion);
    };

    Bomb.prototype.explode_at = function(gridspace) {
      var id, origin, player, sprite, _i, _ref, _ref1, _results, _results1;
      origin = this.owner.game.getOrigin(gridspace);
      sprite = this.owner.game.phaser.add.sprite(origin.x, origin.y, 'explosion');
      sprite.animations.add('explode', (function() {
        _results = [];
        for (var _i = 0, _ref = this.explosion_frames; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this), this.explosion_frames / (this.frame_count / this.explode_speed));
      sprite.animations.play('explode', null, false, true);
      sprite.events.onKilled.add(function() {
        return this.owner.game.dead.add(sprite);
      }, this);
      _ref1 = this.owner.game.players;
      _results1 = [];
      for (id in _ref1) {
        player = _ref1[id];
        if (Object.equal(this.owner.game.getGridSpace(player.sprite), gridspace)) {
          console.log("HES DEAD JIM", player);
          _results1.push(player.die());
        } else {
          _results1.push(void 0);
        }
      }
      return _results1;
    };

    return Bomb;

  })();
  return new Game;
})();

this.Bomberman = Bomberman;



	$(window).on('unload', function () {
		if (!Me.peer.destroyed)
			Me.peer.destroy();
	});

})();