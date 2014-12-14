Bomberman = do () ->
	class Game
		constructor: () ->
			$el = $ '#game'
			self = @

			@me = me = null

			@players = {}

			@collidables = []
			@dead
			@map

			titlescreen = 
				preload: () ->
					@game.load.image 'background', 'images/titlescreenfinal.png'
					@game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
					@game.scale.setScreenSize()

				create: () ->
					titlescreen = @game.add.tileSprite 0, 0, @game.width, @game.height, 'background'
					titlescreen.tileScale.x = 1050 / 1375
					titlescreen.tileScale.y = 630 / 825


			game = 
				preload: () ->
					@game.load.image 'background', 'images/background.png'
					@game.load.spritesheet 'girl', 'images/girl.png', 40, 68
					@game.load.tilemap 'level', 'images/map.json', null, Phaser.Tilemap.TILED_JSON
					@game.load.image 'tiles', 'images/tiles.png'
					@game.load.spritesheet 'bomb', 'images/objects/bomb.png', 70, 70
					@game.load.spritesheet 'explosion', 'images/objects/explosion.png', 70, 70

					@game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
					@game.scale.setScreenSize()
					@game.stage.disableVisibilityChange = true

				create: () ->
					@game.add.tileSprite 0, 0, @game.width, @game.height, 'background'
					@game.physics.startSystem(Phaser.Physics.ARCADE)

					self.map = @game.add.tilemap 'level'
					self.map.addTilesetImage 'tiles'

					self.map.setCollision 1, true, 'breakable'
					breakable = self.map.createLayer 'breakable'
					self.collidables.push breakable

					self.map.setCollision 2, true, 'unbreakable'
					unbreakable = self.map.createLayer 'unbreakable'
					self.collidables.push unbreakable
					# unbreakable.debug = true

					self.dead = @game.add.group()

					player.create() for it, player of self.players
					this

				update: () ->
					player.update @game for id, player of self.players
					this

					self.dead.removeAll(true)





			@phaser = new Phaser.Game 1050, 630, Phaser.AUTO, $el[0]
			@phaser.state.add 'title', titlescreen, true
			@phaser.state.add 'game', game

		setPlayerPositions: (positions) ->
			if typeof positions is 'undefined'
				players = Object.values @players
				players = players.randomize()
			else
				players = players.map (id) ->
					return @players[id]

			for player, i in players
				switch i
					when 0
						player.origin = @getOrigin 0, 0
					when 1
						player.origin = @getOrigin 0, 14
					when 2
						player.origin = @getOrigin 8, 0
					when 3
						player.origin = @getOrigin 8, 14

			players.map (player) ->
				return player.id


		start: () ->
			@phaser.state.start 'game', true
			this

		addPlayer: (id, me = false) ->
			@players[id] = new Player @, id, me

		getGridSpace: (sprite) ->
			x: ((sprite.body.position.x + sprite.body.halfWidth) / 1050 * 15).floor()
			y: ((sprite.body.position.y + sprite.body.halfHeight) / 630 * 9).floor()
		getOrigin: (gridspace) ->
			if typeof gridspace is 'object'
				x: gridspace.x * 70
				y: gridspace.y * 70
			else
				x: arguments[0] * 70
				y: arguments[1] * 70
		inBounds: (x, y) ->
			if (x in [0...15]) and (y in [0...9])
				true
			else
				false

	class Player
		constructor: (@game, @id, @me) ->
			@input = null
			@facing = null
			@velocity = 
				x: 0
				y: 0
			@movespeed = 300
			@sprite = null
			@bombs = []
			@explosion_power = 
				x: 1
				y: 1
			@explosions_stop_on_wall = true
			@origin = 
				x: 0
				y: 0
			@isDead = false

		create: () ->
			console.log 'make player', @
			@sprite = @game.phaser.add.sprite @origin.x, @origin.y, 'girl', 8
			@game.phaser.physics.enable @sprite, Phaser.Physics.ARCADE

			@sprite.body.setSize 40, 40, 0, @sprite.texture.height - 40
			@sprite.body.collideWorldBounds = true

			@sprite.animations.add 'up', [0...8], 10, true
			@sprite.animations.add 'down', [8...16], 10, true
			@sprite.animations.add 'left', [16...24], 10, true
			@sprite.animations.add 'right', [24...32], 10, true

			@sprite.events.onKilled.add () ->
				@game.dead.add @sprite
				# there's no player-player collision so I don't have to remove myself from the collision (yet)
				delete @game
			, this

			if @me
				@input = @game.phaser.input.keyboard.createCursorKeys() # need to change this later
				@input.space = @game.phaser.input.keyboard.addKey Phaser.Keyboard.SPACEBAR

		update: (game) ->
			for collidable in @game.collidables
				game.physics.arcade.collide @sprite, collidable

			if @me
				if @input.space.isDown
					@dropBombThrottled()

				if @input.left.isDown or @input.right.isDown or @input.down.isDown or @input.up.isDown
					Network.send
						evt: 'moving'
						data: 
							# position: @sprite.position
							velocity: @sprite.body.velocity

					if @input.left.isDown
						@sprite.body.velocity.x = -1 * @movespeed
						@sprite.body.velocity.y = 0
						if @facing isnt 'left'
							@sprite.animations.play 'left'
							@facing = 'left'
					else if @input.right.isDown
						@sprite.body.velocity.x = @movespeed
						@sprite.body.velocity.y = 0
						if @facing isnt 'right'
							@sprite.animations.play 'right'
							@facing = 'right'
					else if @input.down.isDown
						@sprite.body.velocity.y = @movespeed
						@sprite.body.velocity.x = 0
						if @facing isnt 'down'
							@sprite.animations.play 'down'
							@facing = 'down'
					else if @input.up.isDown
						@sprite.body.velocity.y = -1 * @movespeed
						@sprite.body.velocity.x = 0
						if @facing isnt 'up'
							@sprite.animations.play 'up'
							@facing = 'up'
				else
					if @facing isnt 'idle'
						@sprite.animations.stop()
						if @facing is 'up'
							@sprite.frame = 0
						else if @facing is 'down'
							@sprite.frame = 8
						else if @facing is 'left'
							@sprite.frame = 16
						else if @facing is 'right'
							@sprite.frame = 24
						@facing = 'idle'
						@sprite.body.velocity.x = 0
						@sprite.body.velocity.y = 0

						Network.send
							evt: 'moveEnd'
							data:
								position: @sprite.position
			# network-controlled players - extend Player class instead?
			else
				@sprite.body.velocity.x = @velocity.x
				@sprite.body.velocity.y = @velocity.y
				if @velocity.x > 0
					@facing = 'right'
					@sprite.animations.play 'right'
				else if @velocity.x < 0
					@facing = 'left'
					@sprite.animations.play 'left'
				else if @velocity.y > 0
					@facing = 'up'
					@sprite.animations.play 'up'
				else if @velocity.y < 0
					@facing = 'down'
					@sprite.animations.play 'down'
				else
					@sprite.animations.stop()
					if @facing is 'up'
						@sprite.frame = 0
					else if @facing is 'down'
						@sprite.frame = 8
					else if @facing is 'left'
						@sprite.frame = 16
					else if @facing is 'right'
						@sprite.frame = 24
					@facing = 'idle'
		dropBombThrottled: (() ->
			@dropBomb()
		).throttle 500
		dropBomb: () ->
			# console.log 'drop bomb'
			bomb = new Bomb @
		die: (force = false) ->
			console.log 'tried to die'
			if Network.client.host_connection or force
				@sprite.kill()
		isMoving: () ->
			!!(@sprite.body.velocity.x or @sprite.body.velocity.y)


	class Bomb
		constructor: (@owner) ->
			@explode_speed = 10
			@frame_count = 6
			@explosion_frames = 5

			@gridspace = @owner.game.getGridSpace(@owner.sprite)
			origin = @owner.game.getOrigin @gridspace

			@sprite = @owner.game.phaser.add.sprite origin.x, origin.y, 'bomb', 0
			@owner.game.phaser.physics.enable @sprite, Phaser.Physics.ARCADE
			# @sprite.body.collideWorldBounds = true # later for bomb pushing
			@sprite.body.immovable = true
			@sprite.animations.add 'explode', [0...@frame_count], @explode_speed
			@sprite.frame = 0

			# console.log @sprite

			@sprite.events.onKilled.add () ->
				@owner.game.dead.add @sprite
				@owner.game.collidables.remove @sprite
				delete @owner
				delete @sprite
			, this


			@owner.game.collidables.push @sprite
			@owner.game.phaser.physics.enable @sprite, Phaser.Physics.ARCADE

			@owner.game.phaser.time.events.add Phaser.Timer.SECOND * 2, @explode, this
		explode: () ->
			# console.log 'bomb explode', @gridspace
			@sprite.animations.play 'explode', null, false, true
			@explode_at @gridspace
			@explode_in_direction @gridspace, 'x', 
				x: 1
				y: 0
			@explode_in_direction @gridspace, 'x', 
				x: -1
				y: 0
			@explode_in_direction @gridspace, 'y', 
				x: 0
				y: 1
			@explode_in_direction @gridspace, 'y', 
				x: 0
				y: -1
		explode_in_direction: (gridspace, xy, direction, distance_from_explosion = 1) ->
			# don't explode here if we're farther than our explosion power
			if distance_from_explosion > @owner.explosion_power[xy]
				return

			# calculate our next tile explosion area
			gridspace = 
				x: gridspace.x + direction.x
				y: gridspace.y + direction.y

			# don't explode here if we're out of bounds
			if !@owner.game.inBounds gridspace.x, gridspace.y
				return

			# explode
			@explode_at gridspace

			# if we're on an unbreakable rock don't continue exploding in this direction
			if @owner.game.map.getTile gridspace.x, gridspace.y, 'unbreakable'
				return

			# if we're on a breakable rock and our explosions don't penetrate walls, don't continue in this direction
			if @owner.game.map.getTile(gridspace.x, gridspace.y, 'breakable') and @owner.explosions_stop_on_wall
				# break the tile in this space though
				@owner.game.map.removeTile gridspace.x, gridspace.y, 'breakable'
				return

			# break the tile in this space
			@owner.game.map.removeTile gridspace.x, gridspace.y, 'breakable'
			@explode_in_direction gridspace, xy, direction, ++distance_from_explosion
		explode_at: (gridspace) ->
			origin = @owner.game.getOrigin gridspace
			sprite = @owner.game.phaser.add.sprite origin.x, origin.y, 'explosion'
			sprite.animations.add 'explode', [0...@explosion_frames], @explosion_frames / (@frame_count / @explode_speed)
			sprite.animations.play 'explode', null, false, true
			sprite.events.onKilled.add () ->
				@owner.game.dead.add(sprite)
			, this

			# see if someone was in the exploded area
			for id, player of @owner.game.players
				if Object.equal @owner.game.getGridSpace(player.sprite), gridspace
					console.log "HES DEAD JIM", player
					player.die()








	new Game

@Bomberman = Bomberman

# Bomberman.setPlayerPositions()
# Bomberman.start()