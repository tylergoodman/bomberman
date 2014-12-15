var GameState = function(game) {
	this.player = null
	this.peers = null
	this.layerManager = null
	this.playerManager = null
	this.explosionManager = null
	this.perkManager = null
	this.preferences = null
	// Array to keep track of players
	this.Players = []
} 

GameState.prototype = {

  preload: function() 	{ 
							this.game.load.atlasJSONHash('sprite1', './static/img/Animations/Bomberman/sprite1Animation.png', './static/img/Animations/Bomberman/sprite1Animation.json');
							this.game.load.atlasJSONHash('sprite2', './static/img/Animations/Sprite2/sprite2.png', './static/img/Animations/Sprite2/sprite2.json');
							this.game.load.atlasJSONHash('sprite3', './static/img/Animations/Sprite3/sprite3.png', './static/img/Animations/Sprite3/sprite3.json');
							this.game.load.atlasJSONHash('sprite4', './static/img/Animations/Sprite4/sprite4.png', './static/img/Animations/Sprite4/sprite4.json');
							this.game.load.atlasJSONHash('explosionAnimation', './static/img/Animations/Explosion/explosionAnimation.png', './static/img/Animations/Explosion/explosionAnimation.json');
							this.game.load.atlasJSONHash('bombAnimation', './static/img/Animations/Bomb/bombAnimation.png', './static/img/Animations/Bomb/bombAnimation.json');
						    this.game.load.image('bomberman', './static/img/bomberman.png')
						    this.game.load.image('bomb', './static/img/bomb.png')
						    this.game.load.image('background', './static/img/background.png')
						    this.game.load.image('unbreakableWall', './static/img/unbreakableWall.jpg')
						    this.game.load.image('breakableWall', './static/img/breakableWall.png')
						    this.game.load.image('explosion', './static/img/explosion.png')
						   	this.game.load.image('normalBombPerk', './static/img/normalBombPerk.png')
						    this.game.load.image('horizontalBombPerk', './static/img/horizontalBombPerk.png')
						    this.game.load.image('verticalBombPerk', './static/img/verticalBombPerk.png')
						    game.load.audio('loop', ['./static/audio/bgMusic.mp3', './static/audio/bgMusic.mp3']);
						    game.load.audio('explosion', ['./static/audio/explosion.wav', './static/audio/explosion.wav']);
						    game.load.audio('powerup', ['./static/audio/powerup.wav', './static/audio/powerup.wav']);
					  	},
  create:  function()	{	
  							// Play Background music
  							this.bgMusic = game.add.audio('loop', 1, true);
				   			this.bgMusic.play();

				   			// Explosion Sound Sprite
				   			this.explosionMusic = game.add.audio('explosion', 1, true);

				   			// Powerup Sound Sprite
				   			this.powerUpMusic = game.add.audio('powerup', 1, true);

  							// Preferences
							this.preferences = new Preferences(this.game, this.Players)

							// background
							var background = this.game.add.group();
					   		background.z = 1;
					   		var bgSprite = this.game.add.sprite(0,0,'background')
					   		bgSprite.scale.setTo(this.preferences.BgWidthRatio, this.preferences.BgHeightRatio)

					   		background.add(bgSprite)

					   		// Managers
					   		this.layerManager = new LayerManager(this.preferences)

					   		// Set up the layers for the world
					   		this.layerManager.SetUpWorld()

					   		// have to setup Perk Manager before Explosion Manager
					   		this.perkManager = new PerkManager(this.preferences, this.layerManager, this.powerUpMusic)

					   		// Set up the world before adding it to explosion manager
					   		this.explosionManager = new ExplosionManager(this.preferences, this.layerManager, this.perkManager, this.explosionMusic)

					   		// Set up player manager to manage all the players
					   		this.playerManager = new PlayerManager(this.preferences, this.layerManager, this.explosionManager)

							//this.player = game.state.states.Game.playerManager.newPlayer(Me.index)
							for(var i = 0; i < this.peers.length; i++)
							{
								this.playerManager.newPlayer(this.peers[i])
							}

							// Reference to this object
							var self = this

							// Resize window if window size changes
							$(window).resize(function() {
								// Update scale values
								self.preferences.updateScaleValues()
								// Update all layers
							  	self.layerManager.ScaleLayers()
							})

							// This event will periodically stop
							// a users animation if they stopped moving 
							this.preferences.World.time.events.loop(Phaser.Timer.SECOND * .5, 
								this.playerManager.UpdateAnimations, 
							this)
				   		},
  update:  function() 	{
  						if(this.playerManager.PlayerExists(this.playerID))
  						{
  							//this.player = this.playerManager.(this.playerID, this.peers)
							if (this.game.input.keyboard.isDown(Phaser.Keyboard.A))
							{
								//this.playerManager.movePlayer(this.player, 2)
								Bomberman.Network.send({
									evt: 'playerMoved',
									data: {PlayerID: this.playerID, Dir: 2},
								});
							}
							else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D))
							{
								//this.playerManager.movePlayer(this.player, 3)
								Bomberman.Network.send({
									evt: 'playerMoved',
									data: {PlayerID: this.playerID, Dir: 3},
								});
							}
							else if (this.game.input.keyboard.isDown(Phaser.Keyboard.W))
							{
								//this.playerManager.movePlayer(this.player, 0)
								Bomberman.Network.send({
									evt: 'playerMoved',
									data: {PlayerID: this.playerID, Dir: 0},
								});
							}
							else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S))
							{
								//this.playerManager.movePlayer(this.player, 1)
								Bomberman.Network.send({
									evt: 'playerMoved',
									data: {PlayerID: this.playerID, Dir: 1},
								});
							}
							else
							{
								this.playerManager.stopAnimation(this.playerID)
							}
							
							// check if f was pressed / second param is for debouncing
							if(this.game.input.keyboard.justPressed(Phaser.Keyboard.F, 10))
							{
								//this.explosionManager.DropBomb(this.player, "Normal")
								Bomberman.Network.send({
									evt: 'bombDropped',
									data: {PlayerID: this.playerID, Type : "Normal"},
								});
							}

							if(this.game.input.keyboard.justPressed(Phaser.Keyboard.C, 10))
							{
								//this.explosionManager.DropBomb(this.player, "Vertical")
								Bomberman.Network.send({
									evt: 'bombDropped',
									data: {PlayerID: this.playerID, Type : "Special"},
								});
							}

							if(this.game.input.keyboard.justPressed(Phaser.Keyboard.M, 10))
							{
								//this.explosionManager.DropBomb(this.player, "Super")
								Bomberman.Network.send({
									evt: 'bombDropped',
									data: {PlayerID: this.playerID, Type : "Super"},
								});
							}

							// update perks
							//host only
							if(Bomberman.Network.host.open)
							{ 
								this.perkManager.Update()
							}

							// Check to see if game is over - has to be outside host check
							this.playerManager.gameOverCheck()
						}
					  	},
	init: function(myId, peersID) 
						{
							// Reset all variables every init
							this.player = null
							this.peers = null
							this.layerManager = null
							this.playerManager = null
							this.explosionManager = null
							this.perkManager = null
							this.preferences = null
							// Array to keep track of players
							this.Players = []

							
					  		this.playerID = myId;
					  		this.peers = peersID;
					  	},
	shutdown: function() 
						{
					  		// stop playing music
					  		this.bgMusic.stop();
  						}
}