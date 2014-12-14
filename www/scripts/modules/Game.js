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
